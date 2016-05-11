/**
 * Controla las funciones de construcción y manipulación de la tabla.
 * Created by mor on 10/05/16.
 */
var table = {
    /**
     * Contenedor de objetos para insertar adecuadamente los iconos de nivel.
     */
    icons: {
        set: {class:"set", file: "set_level_icon.png"},
        unset: {class: "unset", file: "unset_level_icon.png"},
        maxable: {class: "max", file: "max_level_icon.png"}
    },
    /**
     * Mediante recursividad, construye una tabla a partir de un objeto de estadísticas. Si el objeto es un array, dibujará
     * una tabla de una fila para cada posición. Si es un objeto de estadísticas
     * @param statsObj
     * @returns {string}
     */
    build: function(statsObj, tableId) {
        if(util.is(util.stat, statsObj)) { // es un objeto de estadística singular
            return "<tr><td>"+statsObj.name+"</td><td id='"+util.clean(statsObj.name)+"'>"+this.level(statsObj)+"</td></tr>"; // <-- ACABA RECURSIVIDAD
        } else if(util.is(util.stats, statsObj)) { // es un objeto de conjunto de estadísticas
            var subTable = "", stats = statsObj.stats, self = this;
            var tableAdd = function(a) {subTable += a}, len = stats.length;
            tableAdd("<td><div class='table-responsive'><table id='"+util.clean(statsObj.name)+"' class='table'>");
            tableAdd("<thead><th>"+statsObj.name+"</th></thead><tbody><tr>");
            stats.forEach(function(s) {tableAdd(self.build(s, tableId))}); // <-- RECURSIVIDAD HERE
            tableAdd("</tr></tbody></table></div></td>");
            return subTable;
        } else if(util.type(util.arr, statsObj)) { // es un array
            var mainTable = $("table#"+tableId+">tbody");
            var content = "", self = this;
            var contentAdd = function(a) {content += a};
            statsObj.forEach(function(s){contentAdd("<tr>"+self.build(s, tableId)+"</tr>")}); // <-- RECURSIVIDAD HERE
            mainTable.append(content);
        }
    },
    /**
     * Retorna el nivel de una estadística convertida en una cadena de elementos img que lo representan
     * @param stat
     * @returns {string}
     */
    level: function(stat) {
        var ret = "", level = stat.level, icons = this.icons;
        var icon, max = stat.max, lim = stat.limit;
        var iconsDir = "/public/images/icon/";
        // bucle que inserta la imagen de una esfera de nivel. Si el personaje posee ese nivel aprendido, sera roja, y sino, gris
        for(var i = 1; i<=lim; i++) {
            if(stat.hasOwnProperty('max'))  icon = i<=max ? icons.maxable : icons.unset;
            else if(i>level) icon = icons.unset;
            else icon = icons.set;
            ret += "<img class='"+icon.class+"' src='" +iconsDir+icon.file + "'>";
        }
        return ret;
    }
};