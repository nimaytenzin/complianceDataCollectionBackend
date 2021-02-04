const footpath = require('../src/models').footpath

module.exports = {

    //get all the plots in the database Table
    list(req, res){
        return footpath
            .findAll()
            .then((data) => res.status(200).send(data))
            .catch((error) => {res.status(400).send(error)})
    },
    //post into the database
    add(req, res){
        return footpath
            .create({
                fid: req.body.fid,
                lap_id:req.body.lap_id,
                d_status: req.body.d_status,
                width: req.body.width,
                lighting: req.body.lighting,
                friendliness: req.body.friendliness,
                remarks: req.body.remarks
            })
            .then((plotData) => res.status(200).send(plotData))
            .catch((error) => res.status(400).send(error))
    },

    //get specific plot based on the unquie gid for each lap
    getSpecific(req, res){
        return footpath
            .findAll({
                where: {
                    fid: req.params.fid,
                    lap_id:req.params.lap_id
                  }
            })
            .then((plotData) => res.status(200).send(plotData))
            .catch((error) => res.status(400).send(error))
    },

    //get plots by lap id
    getByLapId(req,res){
        return footpath
            .findAll({
                where: {
                    lap_id: req.params.lap_id
                }
            })
            .then((plotsByLap) => res.status(200).send(plotsByLap))
            .catch((error) => res.status(400).send(error))
    },
    // get road seg,emts but 

    //update doesnot works
}