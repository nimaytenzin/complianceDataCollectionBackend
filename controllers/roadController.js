const road = require('../src/models').road

module.exports = {
    //get all class room - READ/ GET ALL
    list(req, res){
        return road
            .findAll()
            .then((data) => res.status(200).send(data))
            .catch((error) => {res.status(400).send(error)})
    },
    
    add(req, res){
        return road
            .create({
                fid: req.body.fid,
                lap_id: req.body.lap_id,
                d_status: req.body.d_status,
                row: req.body.row,
                lanes: req.body.lanes,
                carriage_width: req.body.carriage_width,
                median: req.body.median,
                parking_left: req.body.parking_left,
                parking_right: req.body.parking_right,
                light_left: req.body.light_left,
                light_right: req.body.light_right,
                drain_left: req.body.drain_left,
                drain_right: req.body.drain_right,
                remarks: req.body.remarks
            })
            .then((roadsegmentData) => res.status(200).send(roadsegmentData))
            .catch((error) => res.status(400).send(error))
    },

    getSpecific(req, res){
        return road
            .findAll({
                where: {
                    fid: req.params.fid,
                    lap_id:req.params.lap_id
                  }
            })
            .then((roadsegmentData) => res.status(200).send(roadsegmentData))
            .catch((error) => res.status(400).send(error))
    },
    getByLap(req,res) {
        return roadsegment
            .findAll({
                where: {
                    lap_id: req.params.lap_id
                }
            })
            .then((roadsInLap) => res.status(200).send(roadsInLap))
            .catch((error) => res.status(400).send(error))
    }
}