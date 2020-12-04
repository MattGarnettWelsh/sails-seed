// dependencies
let path = require("path");

let libPath = path.join(__dirname, "lib");

// model extras
let seed = require(path.join(libPath, "seed"));
let seedArray = require(path.join(libPath, "seedArray"));
let seedObject = require(path.join(libPath, "seedObject"));

function getModelsByPriority() {
    return _.sortBy(_.keys(sails.models), (key) => sails.models[key].priority);
}

async function seedModels() {
    let models = getModelsByPriority();

    if (!sails.config.seeds.disable) {
        try {
            sails.log.info("Your seeds are ready to grow!");

            for (let i = 0; i < models.length; i++) {
                const model = models[i];

                if (
                    sails.models[model].seed &&
                    sails.config.seeds[model] &&
                    !(sails.config.seeds[model].active === false)
                )
                    await sails.models[model].seed();
            }
        } catch (err) {
            sails.log.error("Your seeds were not planted correctly");
            sails.log.error(err);
        }
    } else sails.log.info("Seeds are disabled");
}

async function patch() {
    let models = _.toArray(sails.models);

    for (let i = 0; i < models.length; i++) {
        const model = models[i];

        if (model.globalId) {
            await seed(model);
            await seedArray(model);
            await seedObject(model);
        }
    }
}

async function patchAttributes() {
    let models = _.toArray(sails.models);

    for (let i = 0; i < models.length; i++) {
        const model = models[i];

        let data = sails.config.seeds[model.identity];

        if (data) {
            let extend = {};
            if (
                _.some(
                    [data.overwrite, data.unique, data.priority],
                    _.isDefined
                )
            ) {
                extend.seedData = data.data ? data.data : [];
                extend.overwrite = data.overwrite;
                extend.unique = data.unique;
                extend.priority = data.priority;
            } else {
                extend.seedData = data;
                extend.overwrite = false;
                extend.priority = 0;
            }

            _.extend(model, extend);
        } else {
            _.extend(model, {
                seedData: null,
            });
        }
    }
}

module.exports = function initializeHook(sails) {
    return {
        initialize: function (done) {
            // later on wait for this/these event(s)
            // to apply methods to models
            let eventsToWaitFor = [];

            // wait for orm
            // and pub sub hooks
            // to be loaded
            // for methods to
            // be attached to models
            if (sails.hooks.orm) eventsToWaitFor.push("hook:orm:loaded");
            if (sails.hooks.pubsub) eventsToWaitFor.push("hook:pubsub:loaded");

            sails.after(eventsToWaitFor, async () => {
                // bind additional methods
                // to models
                // then seed models
                // and let sails continue

                await patchAttributes();
                await patch();

                await seedModels();

                done();
            });
        },
    };
};
