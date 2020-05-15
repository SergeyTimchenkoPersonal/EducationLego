const { Schema } = mongoose;

const legoProgramSchema = new Schema({
  name: String,
  type: String,
  fileName: String,
});

module.exports = model('LegoProgram', legoProgramSchema)
