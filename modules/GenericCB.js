//This callback function does nothing
//Only used for modifying/inserting in the DB
//Used as a placeholder

module.exports = {
    GenericCB: function(err, result,res, req){
        if(err){
            console.log(err);
        }
    }
}