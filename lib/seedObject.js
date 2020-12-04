module.exports = function createDataFromSeedObject(model) {
    async function seedObject() {
        let self = this;
        const { unique, seedData: record } = self;

        let modelName =
            self.identity.charAt(0).toUpperCase() + self.identity.slice(1);

        try {
            if (unique) {
                const uniqueValues = _.pick(record, unique);

                await self.findOrCreate(uniqueValues, record);
            } else {
                await self.create(record);

                sails.log.debug(`${modelName} seed planted`);
            }
        } catch (err) {
            sails.log.error(err);
        }
    }

    model.seedObject = seedObject;
};
