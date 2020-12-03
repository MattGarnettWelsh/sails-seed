module.exports = function createDataFromSeedArray(model) {
    async function seedArray(callback) {
        let self = this;
        let modelName =
            self.identity.charAt(0).toUpperCase() + self.identity.slice(1);

        if (self.unique) {
            try {
                for (let index = 0; index < self.seedData.length; index++) {
                    const record = self.seedData[index];
                    const uniqueValues = _.pick(record, self.unique);

                    await self.findOrCreate(uniqueValues, record);
                }

                sails.log.debug(`${modelName} seed planted`);
            } catch (err) {
                sails.log.error(err);
            }

            return callback();
        }

        try {
            await self.createEach(self.seedData);

            sails.log.debug(`${modelName} seed planted`);
        } catch (err) {
            sails.log.error(err);
        }

        return callback();
    }

    model.seedArray = seedArray;
};
