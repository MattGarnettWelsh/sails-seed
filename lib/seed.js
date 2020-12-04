module.exports = function seedAllModelData(model) {
    async function seed() {
        let self = this;
        const { overwrite, unique, seedData } = self;

        let modelName =
            self.identity.charAt(0).toUpperCase() + self.identity.slice(1);

        if (!seedData) {
            sails.log.debug(`No data available to seed ${modelName}`);

            return;
        }

        try {
            let count = await self.count();

            if (count === 0) {
                sails.log.debug(`Seeding ${modelName}...`);

                if (seedData instanceof Array) await self.seedArray();
                else await self.seedObject();
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
                    if (seedData instanceof Array) await self.seedArray();
                    else await self.seedObject();

                    sails.log.debug(`${modelName} data seeded`);
                }
            }
        } catch (err) {
            sails.log.error(err);
        }
    }

    model.seed = seed;
};
