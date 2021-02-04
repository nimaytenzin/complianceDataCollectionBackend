const roadShapefile = require('../src/models').roadShapefile
const pool = require('../dbconfig')


module.exports = {

    list(req, res){
        pool.query(
            `select ST_AsGeoJSON(geom) from "footpath_shapefile";`, (err,results)=>{
                if (err){
                    throw err
                }
                const resp = results.rows.map((row)=>{
                    let geojson=JSON.parse(row.st_asgeojson);
                    return geojson;
                })
                return resp
            }
           );      
    },
    
}