module.exports = function createDataFromSeedArray(model) {
    async function seedArray() {
        let self = this;
        const { unique, seedData } = self;

        let modelName =
            self.identity.charAt(0).toUpperCase() + self.identity.slice(1);

        if (unique) {
            try {
                for (let index = 0; index < seedData.length; index++) {
                    const record = seedData[index];
                    const uniqueValues = _.pick(record, unique);

                    await self.findOrCreate(uniqueValues, record);
                }

                sails.log.debug(`${modelName} seed planted`);
            } catch (err) {
                sails.log.error(err);
            }

            return;
        }

        try {
            await self.createEach(seedData);

            sails.log.debug(`${modelName} seed planted`);
        } catch (err) {
            sails.log.error(err);
        }
    }

    model.seedArray = seedArray;
};
