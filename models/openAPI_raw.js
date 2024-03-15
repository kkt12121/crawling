// module.exports = (sequelize, DataTypes) => (
//     sequelize.define('openAPI_raw', {
//         title: {
//             type: DataTypes.TEXT
//         },
//         department: {
//             type: DataTypes.STRING
//         },
//         type: {
//             type: DataTypes.STRING
//         },
//         category: {
//             type: DataTypes.STRING
//         },
//         index: {
//             type: DataTypes.STRING
//         },
//         date: {
//             type: DataTypes.DATEONLY
//         },
//         start: {
//             type: DataTypes.DATEONLY
//         },
//         content: {
//             type: DataTypes.TEXT('medium')
//         }
//     }, {
//         timestamps: false,
//         paranoid: false,
//         // DB 한글 입력 //////////////////////
//         charset: 'utf8',
//         collate: 'utf8_general_ci',
//     })
// );