module.exports = (sequelize, DataTypes) => (
    sequelize.define('openAPI_caseNote', {
        type: {
            type: DataTypes.TEXT
        },
        title: {
            type: DataTypes.TEXT
        },
        content: {
            type: DataTypes.TEXT('medium')
        },
        summary: {
            type: DataTypes.TEXT('medium')
        }
    }, {
        timestamps: false,
        paranoid: false,
        // DB 한글 입력 //////////////////////
        charset: 'utf8',
        collate: 'utf8_general_ci',
    })
);