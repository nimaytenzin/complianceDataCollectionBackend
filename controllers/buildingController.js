const building = require('../src/models').building

module.exports = {

    //get all the plots in the database Table
    list(req, res){
        return building
            .findAll()
            .then((data) => res.status(200).send(data))
            .catch((error) => {res.status(400).send(error)})
    },
 //find specific
    getbuildingDetail(req,res){
        return building
            .findAll({
                where: {
                    structure_id: req.params.id
                }
            })
            .then((data) => res.status(200).send(data[0]))
            .catch((error) => res.status(400).send(error))
    },
}