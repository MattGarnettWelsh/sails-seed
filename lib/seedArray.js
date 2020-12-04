module.exports = function createDataFromSeedArray(model) {
    async function seedArray() {
        let self = this;
        const { unique, seedData } = self;

        let modelName =
            self.identity.charAt(0).toUpperCase() + self.identity.slice(1);

        if (unique) {
            try {
                for (let i = 0; i < seedData.length; i++) {
                    const record = seedData[i];
                    const uniqueValues = _.pick(record, unique);

                    sails.log.debug("uniqueValues", uniqueValues);
                    sails.log.debug("record", record);

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
