var LogicEvaluator = function(interpreter)
{
    this.interpreter = interpreter || null;
};

LogicEvaluator.prototype.evaluate = function(context, input)
{
    throw "Not implemented!";

    return false;
};

// Exports
module.exports = LogicEvaluator;