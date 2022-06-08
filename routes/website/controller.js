const { validationResult } = require('express-validator');
const { Website } = require('../../models/Websites');
const { ParseWebsiteData, EncodeWebsiteData } = require('../../middlewares/tools');

exports.createWebsite = async (req, res, next) => {
    try {
        const errors = validationResult(req).errors;
        if (errors.length > 0) throw new Error(errors[0].msg);

        const website = new Website({...req.body});
        const result = await website.save({ ordered: false });

        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}

exports.getWebsite = async (req, res, next) => {
    try {
        const errors = validationResult(req).errors;
        if (errors.length > 0) throw new Error(errors[0].msg);
        
        const { websiteId } = req.query;
        
        const result = await Website.findOne({ _id: websiteId });

        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}

exports.getWebsites = async (req, res, next) => {
    try {
        const errors = validationResult(req).errors;
        if (errors.length > 0) throw new Error(errors[0].msg);

        const { memberId } = req.query;

        const result = await Website.find({ memberId });

        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}

exports.updateWebsite = async (req, res, next) => {
    try {
        const errors = validationResult(req).errors;
        if (errors.length > 0) throw new Error(errors[0].msg);

        const { websiteId, ...websiteData} = req.body;

        await Website.updateOne({ _id: websiteId }, {
            ...websiteData
        })

        res.status(200).json({
            _id: websiteId,
            ...websiteData
        });

    } catch (err) {
        next(err);
    }
}

exports.deleteWebsite = async (req, res, next) => {
    try {
        const errors = validationResult(req).errors;
        if (errors.length > 0) throw new Error(errors[0].msg);

        const { websiteId } = req.body;

        const result = await Website.deleteOne({ _id: websiteId });

        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}

exports.updateExpiration = async (req, res, next) => {
    try {
        const errors = validationResult(req).errors;
        if (errors.length > 0) throw new Error(errors[0].msg);

        const { websiteId, isExpired } = req.body;

        await Website.updateOne({ _id: websiteId }, {
            $set: { 
                isExpired
            }
        });

        res.sendStatus(200);

    } catch (err) {
        next(err);
    }
}

exports.updateTemplate = async (req, res, next) => {
    try {
        const errors = validationResult(req).errors;
        if (errors.length > 0) throw new Error(errors[0].msg);

        const { websiteId, template } = req.body;

        const currentWebsite = await Website.findOne({ _id: websiteId });

        if (!currentWebsite) throw new Error('Cannot fetch website');

        let decompressedObj = ParseWebsiteData(currentWebsite.data);

        if (!decompressedObj) throw new Error('Cannot decompress data');

        decompressedObj.template = template;

        const compressed = EncodeWebsiteData(decompressedObj);

        await Website.updateOne({ _id: websiteId }, {
            $set: { 
                data: compressed
            }
        });

        res.status(200).json({ data: compressed });

    } catch (err) {
        next(err);
    }
}

exports.updateStyle = async (req, res, next) => {
    try {
        const errors = validationResult(req).errors;
        if (errors.length > 0) throw new Error(errors[0].msg);

        const { websiteId, style } = req.body;

        const currentWebsite = await Website.findOne({ _id: websiteId });

        if (!currentWebsite) throw new Error('Cannot fetch website');

        let decompressedObj = ParseWebsiteData(currentWebsite.data);

        if (!decompressedObj) throw new Error('Cannot decompress data');

        decompressedObj.style = style;

        const compressed = EncodeWebsiteData(decompressedObj);

        await Website.updateOne({ _id: websiteId }, {
            $set: { 
                data: compressed
            }
        });

        res.status(200).json({ data: compressed });

    } catch (err) {
        next(err);
    }
}