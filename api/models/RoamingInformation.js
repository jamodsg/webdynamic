module.exports = {
  tableName:'ac_roaming_info',
  attributes: {
    id: {
      type: 'integer',
      required: false,
      primaryKey: true,
      autoIncrement: true
    },
    countyName: {
      type: 'string',
      required: true
    },
    countryCode: {
      type: 'string',
      required: true
    },
    operatorName: {
      type: 'string',
      required: true
    },
    operatorCode: {
      type: 'string',
      required: true
    },
    smsPrice: {
      type: 'string',
      required: true
    },
    callPrice: {
      type: 'string',
      required: true
    },
    contentEn: {
      type: 'string',
      index: 'fulltext'
    },
    contentAr: {
      type: 'string',
      index: 'fulltext'
    },
    contentKu: {
      type: 'string',
      index: 'fulltext'
    }
  }
};
