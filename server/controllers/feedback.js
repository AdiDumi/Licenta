const FeedbackSchema = require('../models/Feedback');

const addFeedback = (req, res) => {
    const {receiver, message, type, anonymous, visibleForManager} = req.body;
    if (!receiver || !message || type === undefined || anonymous === undefined || visibleForManager === undefined)
        return res.status(400).send({error: 'Add feedback does not have all necessary data'});

    const newFeedback = new FeedbackSchema({
        receiver: receiver,
        reporter: {
            dn: req.user,
            cn: req.cn,
            uid: req.uid,
            mail: req.mail,
            displayName: req.displayName
        },
        visibleForManager: visibleForManager,
        message: message,
        type: type,
        anonymous: anonymous,
        manager: receiver.manager
    });

    newFeedback.save();
    return res.status(200).send({message: 'Feedback added successfully'});
};

const getSentFeedback = (req, res) => {
    const user = req.user;
    FeedbackSchema.find({'reporter.dn': user}, (err, docs) => {
        if (err) return res.status(400).send({error: err});
        return res.status(200).send(docs);
    });
};

const getRecvFeedback = (req, res) => {
    const user = req.user;
    FeedbackSchema.find({'receiver.dn': user}, (err, docs) => {
        if (err) return res.status(400).send({error: err});
        return res.status(200).send(docs);
    });
};

const markAsSeen = (req, res) => {
    FeedbackSchema.findOne({_id: req.body._id}, (err, doc) => {
        if (err) return res.status(400).send({error: err});
        if (doc.receiver.dn != req.user) return res.status(400).send({error: "User cannot edit this feedback"})

        doc.seen = true;
        doc.save();
        res.status(200).send({message: 'Feedback marked as seen'});
    });
};

const markAsLiked = (req, res) => {
    FeedbackSchema.findOne({_id: req.body._id}, (err, doc) => {
        if (err) return res.status(400).send({error: err});
        if (doc.receiver.dn != req.user) return res.status(400).send({error: "User cannot edit this feedback"})

        doc.appreciated = true;
        doc.save();
        res.status(200).send({message: 'Feedback marked as appreciated'});
    });
};

const getTeamFeedback = (req, res) => {
    const user = req.user;
    FeedbackSchema.find({manager: user, visibleForManager: true}, (err, docs) => {
        if (err) return res.status(400).send({error: err});
        return res.status(200).send({isManager: req.isManager, teamFeedback: docs});
    });
};

module.exports = {
    addFeedback,
    getSentFeedback,
    getRecvFeedback,
    markAsSeen,
    markAsLiked,
    getTeamFeedback
};