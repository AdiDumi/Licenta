const ObjectiveSchema = require('../models/Objective');
const inProgress = 1;
const done = 2;
const expired = 3;

const addMainObjective = (req, res) => {
    const {title, description} = req.body;
    if (!title || !description) return res.status(400).send({error: 'Add objective does not have all necessary data'});

    const newObjective = new ObjectiveSchema({
        user: {
            dn: req.user,
            cn: req.cn,
            uid: req.uid,
            mail: req.mail,
            displayName: req.displayName
        },
        manager: req.manager,
        title: title,
        description: description,
        type: 1
    });

    newObjective.save()
    return res.status(200).send({message: 'Objective added successfully'});
};

const addSecondaryObjective = (req, res) => {
    const {title, target, targetUnitMeasure, deadline, mainObjective} = req.body;
    if (!title || !target || !targetUnitMeasure || !deadline || !mainObjective)
        return res.status(400).send({error: 'Add objective does not have all necessary data'});
   
        ObjectiveSchema.findOne({_id: mainObjective}, (err, doc) => {
            if (err) return res.status(400).send({error: err});
            if (doc.type != 1) return res.status(400).send({error: "Can add secondary objective only to main objectives"})
            if (doc.status == done) return res.status(400).send({error: "Cannot add objectives to main objective with done status"})

            if (!doc.status) {doc.status = inProgress; doc.save()}

            const currentDate = new Date()
            const deadlineDate = new Date(deadline)
            if (currentDate >= deadlineDate) return res.status(400).send({error: "Deadline should be grater than today"})
        

            const newObjective = new ObjectiveSchema({
                user: {
                    dn: req.user,
                    cn: req.cn,
                    uid: req.uid,
                    mail: req.mail,
                    displayName: req.displayName
                },
                manager: req.manager,
                title: title,
                type: 2,
                target: target,
                targetUnitMeasure: targetUnitMeasure,
                deadline: deadline,
                mainObjective: mainObjective
            });
        
            newObjective.save()
            return res.status(200).send({message: 'Objective added successfully'});
        })
};

const editProgress = (req, res) => {
    ObjectiveSchema.findOne({_id: req.body.objective._id, 'user.dn': req.user}, (err, doc) => {
        if (doc.type == 1) return res.status(400).send({error: "Cannnot edit main objective progress"})
        if (err) return res.status(400).send({error: err});
        if (doc.status == done) return res.status(400).send({error: "Objective already finished"})

        const currentDate = new Date()
        const deadline = new Date(doc.deadline)
        if (currentDate >= deadline) return res.status(400).send({error: "Cannot edit progress after deadline"})

        if (req.body.progress > doc.target) return res.status(400).send({error: "Progress cannot be greater than target"})
        doc.progress = req.body.progress;
        if (!doc.status) {
            doc.status = inProgress;
        }
        if (doc.progress == doc.target)
            doc.status = done;
        doc.save();
        res.status(200).send({message: 'Progress updated'});
    })
}

const editProgressMain = (req, res) => { 
    ObjectiveSchema.findOne({_id: req.body.objective._id, 'user.dn': req.user}, (err, doc) => {
        if (doc.type == 2) return res.status(400).send({error: "Cannnot edit objective progress"})
        if (err) return res.status(400).send({error: err});
        if (doc.status == done) return res.status(400).send({error: "Objective already finished"})

        if (req.body.progress > 100.00) return res.status(400).send({error: "Objective's progress greater than 100%"})
        doc.progress = req.body.progress;
        doc.save();
        res.status(200).send({message: 'Progress updated'});
    })
}

const getMainObjectives = (req, res) => {
    const user = req.user;
    ObjectiveSchema.find({'user.dn': user, 'type':1}, (err, docs) => {
        if (err) return res.status(400).send({error: err});
        return res.status(200).send(docs);
    });
}

const getSecondaryObjectives = (req, res) => {
    const user = req.user;
    ObjectiveSchema.find({'user.dn': user, 'type':2, 'mainObjective': req.query.mainObjective}, (err, docs) => {
        if (err) return res.status(400).send({error: err});
        const currentDate = new Date();
        docs.forEach(element => {if (element.deadline < currentDate && element.status != done){element.status = expired; element.save();} })
        return res.status(200).send(docs);
    });
}

const getMainTeamObjectives = (req, res) => {
    const user = req.user;
    if (!req.isManager) return res.status(200).send({isManager: false})
    ObjectiveSchema.find({'manager': user, 'type':1}, (err, docs) => {
        if (err) return res.status(400).send({error: err});
        return res.status(200).send({objectives: docs, isManager: true});
    });
}

const getSecondaryTeamObjectives = (req, res) => {
    const user = req.user;
    if (!req.isManager) return res.status(200).send({isManager: false})
    ObjectiveSchema.find({'manager': user, 'type':2, 'mainObjective': req.query.mainObjective}, (err, docs) => {
        if (err) return res.status(400).send({error: err});
        const currentDate = new Date();
        docs.forEach(element => {if (element.deadline < currentDate && element.status != done){element.status = expired; element.save();} })
        return res.status(200).send({objectives: docs, isManager: true});
    });
}

const editTeamObjective = (req, res) => {
    ObjectiveSchema.findOne({_id: req.body.objective._id}, (err, doc) => {
        if (err) return res.status(400).send({error: err});

        if (doc.manager !== req.user) return res.status(400).send({error: "User is not manager for this objective"})

        if (req.body.title !== undefined) doc.title = req.body.title;
        if (doc.type == 1 && req.body.description !== undefined) doc.description = req.body.description;

        if (doc.type == 2) {
            if (req.body.target !== undefined) doc.target = req.body.target;
            if (req.body.targetUnitMeasure !== undefined) doc.targetUnitMeasure = req.body.targetUnitMeasure;
            if (req.body.deadline !== undefined) {
                deadline = req.body.deadline
                const currentDate = new Date()
                const deadlineDate = new Date(deadline)
                if (currentDate >= deadlineDate) return res.status(400).send({error: "Deadline should be grater than today"})
                doc.deadline = req.body.deadline;
            }
            if (req.body.progress !== undefined && req.body.progress > doc.target) doc.progress = req.body.progress;

            if (doc.progress == doc.target)
                doc.status = done
        }

        doc.save();
        res.status(200).send({message: 'Objective updated'});
    })
}

const markAsDone = (req, res) => {
    const user = req.user;
    ObjectiveSchema.findOne({_id: req.body.objective._id, 'type': 1}, (err, doc) => {
        if (err) return res.status(400).send({error: err});

        if (doc.user.dn == req.user) {
            ObjectiveSchema.find({'user.dn': user, 'type':2, 'mainObjective': req.body.objective._id}, (err, docs) => {
                if (err) return res.status(400).send({error: err});
                
                let allDone = true
                docs.forEach(element => {if (element.status != done && element.status != expired) allDone = false})
    
                if(!allDone) return res.status(400).send({error: "All secondary objectives should be done before marking main objective as done"})
                doc.status = done
                doc.save();
                res.status(200).send({message: 'Objective updated'});
            });
        }
        else if (doc.manager == req.user) {
            ObjectiveSchema.find({'manager': user, 'type':2, 'mainObjective': req.body.objective._id}, (err, docs) => {
                if (err) return res.status(400).send({error: err});
                
                let allDone = true
                docs.forEach(element => {if (element.status != done && element.status != expired) allDone = false})
    
                if(!allDone) return res.status(400).send({error: "All secondary objectives should be done before marking main objective as done"})
                doc.status = done
                doc.save();
                res.status(200).send({message: 'Objective updated'});
            });
        }
        else {
            return res.status(400).send({error: "Current user cannot edit this objective"})
        }

    });
}

module.exports = {
    addMainObjective,
    addSecondaryObjective,
    editProgress,
    editProgressMain,
    getMainObjectives,
    getSecondaryObjectives,
    getMainTeamObjectives,
    getSecondaryTeamObjectives,
    editTeamObjective,
    markAsDone
};