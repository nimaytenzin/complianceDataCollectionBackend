var express = require('express');
var router = express.Router();


const plotController = require('../controllers/plotController');
const roadController = require('../controllers/roadController');
const thromdeController = require('../controllers/thromdeController')
const footpathController = require('../controllers/footpathController')
const imageController = require('../controllers/imageController')
const {pool} = require('../dbconfig');
const buildingController = require('../controllers/buildingController');

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

/**Table routes */
// plots route
router.get('/api/plots/get-plot/:lap_id/:fid', plotController.getSpecific)
router.get('/api/plots/get-plots/:lap_id', plotController.getByLapId)
router.post('/api/plots/add-plot', plotController.add);
router.put('/api/plots/update-plot/:lap_id/:fid', plotController.update)

//footpath route
router.get('/api/footpaths/get-all', footpathController.list);
router.post('/api/footpaths/add-path',footpathController.add);
router.get('/api/footpaths/get-path/:lap_id/:fid', footpathController.getSpecific)

//
router.get('/api/buildings/get-all/:lap_id', (req,res) => {
  let lap_id = parseInt(req.params.lap_id)
  pool.query(`SELECT * FROM buildings WHERE lap_id = ${lap_id}`)
})
//road routes
router.get('/api/roads/get-all',roadController.list);
router.post('/api/roads/add-road',roadController.add);
router.get('/api/roads/getByLap/:lap_id', roadController.getByLap)
router.get('/api/roads/get-road/:lap_id/:fid', roadController.getSpecific)


//image routes
router.post('/api/images/add-image',imageController.createImage)
router.get('/api/images/get-image/:ftype/:fid', imageController.getImage)

//building Shapefile routes
router.get('/api/shapefile/get-buildings/:lap_id', (req,res)=>{
  let lap_id = parseInt(req.params.lap_id)
  pool.query(`SELECT jsonb_build_object(
    'type',     'FeatureCollection',
    'features', jsonb_agg(features.feature)
)
FROM (
  SELECT jsonb_build_object(
    'type',       'Feature',
    'id',         structure_,
    'geometry',   ST_AsGeoJSON(geom)::jsonb,
    'properties', to_jsonb(inputs)  - 'geom'
  ) AS feature  
  FROM (SELECT * FROM building_shape where lap_id= ${lap_id}) inputs) features;`, (err, results) => {
    if (err) {
      throw err
    }
    res.send(results.rows[0].jsonb_build_object)
  })
})

router.get('/api/buildings/get-all',buildingController.list);
router.get('/api/buildings/get-building/:id', buildingController.getbuildingDetail);

router.put('/api/shapefile/set-done/:lap_id/:gid', (req,res) => {
  let lapid = parseInt(req.params.lap_id)
  let giid = parseInt(req.params.gid)
  pool.query(`
  UPDATE plots_shape SET done = 'true' WHERE  lap_id = ${lapid} AND gid = ${giid}
  `, (err, ress) => {
    if (err) {
      throw err
    }
    res.send(ress)
  });
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
        'properties', to_jsonb(inputs)  - 'geom'
      ) AS feature  
      FROM (SELECT * FROM plots_shape where lap_id= ${lap_id}) inputs) features;`, (err, results) => {
        if (err) {
          throw err
        }
        res.send(results.rows[0].jsonb_build_object)
      })
})

//get roads by lapID
router.get('/api/shapefile/get-roads/:lap_id', (req,res) => {
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
      'properties', to_jsonb(inputs)  - 'geom'
    ) AS feature  
    FROM (SELECT * FROM roads_shape where lap_id= ${lap_id}) inputs) features;`, (err, results) => {
      if (err) {
        throw err
      }
      res.send(results.rows[0].jsonb_build_object)
    })
})

router.get('/api/shapefile/get-footpaths/:lap_id', (req,res) => {
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
      'properties', to_jsonb(inputs)  - 'geom'
    ) AS feature  
    FROM (SELECT * FROM footpaths_shape where lap_id= ${lap_id}) inputs) features;`, (err, results) => {
      if (err) {
        throw err
      }
      res.send(results.rows[0].jsonb_build_object)
    })
})




module.exports = router;
