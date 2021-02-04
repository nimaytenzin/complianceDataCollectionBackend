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
router.get('/api/plots/get-plot/:lap_id/:fid', plotController.getSpecific)
router.get('/api/plots/get-plots/:lap_id', plotController.getByLapId)
router.post('/api/plots/add-plot', plotController.add);
router.put('/api/plots/update-plot/:lap_id/:gid', plotController.update)

//footpath route
router.get('/api/footpaths/get-all', footpathController.list);
router.post('/api/footpaths/add-path',footpathController.add);
router.get('/api/footpaths/get-path/:lap_id/:fid', footpathController.getSpecific)


//road routes
router.get('/api/roads/get-all',roadController.list);
router.post('/api/roads/add-road',roadController.add);
router.get('/api/roads/getByLap/:lap_id', roadController.getByLap)
router.get('/api/roads/get-road/:lap_id/:fid', roadController.getSpecific)

//footpath rotes
// router.get('/api/footpaths/get-footpaths', footpathController.list);
// router.post('/api/footpaths/add-footpath', footpathController.add);
// router.get('/api/footpaths/getByLap/:lap_id', footpathController.getByLapId)

//



// raw query for getting shapefiles as geojson

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
      FROM (SELECT * FROM plots_shape where lap_id= ${lap_id}) inputs) features;`, (err, results) => {
        if (err) {
          throw err
        }
        res.send(results.rows[0].jsonb_build_object)
      })
})




module.exports = router;
