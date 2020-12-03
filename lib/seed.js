module.exports = function seedAllModelData(model) {
    async function seed(callback) {
        let self = this;
        const { overwrite, unique, seedData } = self;

        let modelName =
            self.identity.charAt(0).toUpperCase() + self.identity.slice(1);

        if (!seedData) {
            sails.log.debug(`No data available to seed ${modelName}`);
            return callback();
        }

        try {
            let count = await self.count();

            if (count === 0) {
                sails.log.debug(`Seeding ${modelName}...`);

                if (seedData instanceof Array) await self.seedArray(callback);
                else await self.seedObject(callback);
            } else {
                if (overwrite) {
                    sails.log.debug(
                        `Deleting all ${modelName} intances before seeding`
                    );
                    await self.destroy({});
                } else if (unique) {
                    sails.log.debug(
                        `${modelName} had models, seeding unique data now`
                    );
                } else
                    sails.log.debug(
                        `${modelName} had models, so no seed needed`
                    );

                if (overwrite || unique) {
                    if (seedData instanceof Array)
                        await self.seedArray(callback);
                    else await self.seedObject(callback);

                    sails.log.debug(`${modelName} data seeded`);
                }

                return callback();
            }
        } catch (err) {
            sails.log.error(err);
        }
    }

    model.seed = seed;
};
