class Utils {

    static dateFormat(date) { // Método estático

        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes()

    }
}