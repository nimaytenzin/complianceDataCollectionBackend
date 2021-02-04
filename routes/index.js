var express = require('express');
var router = express.Router();


const plotController = require('../controllers/plotController');
const roadController = require('../controllers/roadController');
const thromdeController = require('../controllers/thromdeController')
const footpathController = require('../controllers/footpathController')

const {pool} = require('../dbconfig')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CDRS' });
});


//Thromde and Lap
router.get('/api/get-thromdes',(req, res) =>{
  pool.query('SELECT * FROM thromdes', (err,results) =>{
    res.send(results.rows)
  })
} )
router.get('/api/get-laps/:thromde_id', thromdeController.getLapbyThromde)


// plots route
router.get('/api/plots/get-plot/:lap_id', plotController.getSpecific)
router.get('/api/plots/get-plots/:lap_id', plotController.getByLapId)
router.post('/api/plots/add-plot', plotController.add);
router.put('/api/plots/update-plot/:lap_id/:gid', plotController.update)

//footpath route
router.get('/api/footpaths/get-all', footpathController.list);
router.post('/api/footpaths/add-path',footpathController.add);


//road routes
router.get('/api/roads/get-all',roadController.list);
router.post('/api/roads/add-road',roadController.add);
router.get('/api/roads/getByLap/:lap_id', roadController.getByLap)

//footpath rotes
// router.get('/api/footpaths/get-footpaths', footpathController.list);
// router.post('/api/footpaths/add-footpath', footpathController.add);
// router.get('/api/footpaths/getByLap/:lap_id', footpathController.getByLapId)

//



// raw query for getting shapefiles as geojson
router.get('/get-all-roads', (req,res) => { 
  pool.query(
    `select ST_AsGeoJSON(geom) from simtokha_plots ;`, (err,results)=>{
        if (err){
            throw err
        }
        const resp = results.rows.map((row)=>{
            let geojson=JSON.parse(row.st_asgeojson);
            geojson.properties = {}
            return geojson;
        })
        // console.log(resp);
        res.send(resp)
    }
   );
})


router.get('/api/shapefile/get-plots/:thromde_id/:lap_id', (req,res) => {
    let thromde_id = req.params.thromde_id;
    let lap_id = req.params.lap_id;
    pool.query(
      `select ST_AsGeoJSON(geom),gid,plot_id,precinct,area_acres,area_m2,coverage,setback,height,thromdeid,lap_id from plotshape Where thromdeid=${thromde_id} AND lap_id =${lap_id} ;`, (err,results)=>{
          if (err){
              throw err
          }
          console.log(results)
          const resp = results.rows.map((row)=>{
              let geojson=JSON.parse(row.st_asgeojson);
              geojson.properties = {
                thromde_id:row.thromdeid,
                lap_id:row.lap_id,
                gid:row.gid,
                plot_id:row.plot_id,
                precicnt:row.precicnt,
                area_acres:row.area_acres,
                area_m2:row.area_m2,
                coverage:row.coverage,
                setback:row.setback,
                height:row.height  
              }
              return geojson;
          })
          // console.log(resp);
          res.send(resp)
      }
     );
  })
  
//get all plots

router.get('/api/shapefile/get-all-plots', (req,res)=> {
    pool.query(`SELECT jsonb_build_object(
        'type',     'FeatureCollection',
        'features', jsonb_agg(features.feature)
    )
    FROM (
      SELECT jsonb_build_object(
        'type',       'Feature',
        'id',         gid,
        'geometry',   ST_AsGeoJSON(geom)::jsonb,
        'properties', to_jsonb(inputs) - 'gid' - 'geom'
      ) AS feature
      FROM (SELECT * FROM trial_plots) inputs) features;`, (err, results) => {
        if (err) {
          throw err
        }
        res.send(results.rows[0].jsonb_build_object)
      })
})

//get plots by lap id

router.get('/api/shapefile/get-plots/:lap_id', (req,res) => {
    let lap_id =  req.params.lap_id
    pool.query(`SELECT jsonb_build_object(
        'type',     'FeatureCollection',
        'features', jsonb_agg(features.feature)
    )
    FROM (
      SELECT jsonb_build_object(
        'type',       'Feature',
        'id',         gid,
        'geometry',   ST_AsGeoJSON(geom)::jsonb,
        'properties', to_jsonb(inputs) - 'gid' - 'geom'
      ) AS feature  
      FROM (SELECT * FROM trial_plots where lap_id= ${lap_id}) inputs) features;`, (err, results) => {
        if (err) {
          throw err
        }
        res.send(results.rows[0].jsonb_build_object)
      })
})








module.exports = router;
