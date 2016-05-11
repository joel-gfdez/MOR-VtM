/**
 * Objeto que contiene diversas utilidades para el objeto personaje..
 * Created by mor on 10/05/16.
 */

var charUtils = {
    /**
     * Lista de disciplinas de cada clan
     */
    clans: {
        assamita_guerrero: ['Celeridad', 'Extinción', 'Ofuscación'],
        assamita_hechicero: ['Auspex', 'Extinción', 'Hechicería assamita'],
        assamita_visir: ['Auspex', 'Celeridad', 'Extinción'],
        brujah: ['Celeridad', 'Potencia', 'Presencia'],
        capadocio: ['Auspex', 'Fortaleza', 'Mortis'],
        seguidor_de_set: ['Ofuscación', 'Presencia', 'Serpentis'],
        gangrel: ['Animalismo', 'Fortaleza', 'Protean'],
        lasombra: ['Dominación', 'Obtenebración', 'Potencia'],
        malkavian: ['Auspex', 'Dementación', 'Ofuscación'],
        nosferatu: ['Animalismo', 'Ofuscación', 'Potencia'],
        ravnos: ['Animalismo', 'Fortaleza', 'Quimerismo'],
        tremere: ['Auspex', 'Dominación', 'Taumaturgia'],
        toreaor: ['Auspex', 'Celeridad', 'Presencia'],
        tzimisce: ['Animalismo', 'Auspex', 'Vicisitud'],
        ventrue: ['Dominación', 'Fortaleza', 'Presencia']
    },
    /**
     * Retorna la lista de disciplinas del clan especificado
     * @param n Nombre del clan
     * @returns {Array}
     */
    getDiscs: function(n) {
        var ret = [], clanName = util.clean(n);
        var self = this, clans = this.clans;
        for(var clan in clans)
            if(clanName === clan && (util.type(util.arr, clans[clan]) && clans[clan].length == 3))
                clans[clan].forEach(
                    function(disc) {ret.push(self.createDisc(disc))}
                );
        return ret;
    },
    /**
     * Crea un objeto de disciplina a partir del nombre
     * @param n Nombre de la disciplina
     * @returns {object}
     */
    createDisc: function(n) {
        return {name: n, level: 0, limit: 10, mod: 0,
            setMod: function(m) {this.mod = m}, addLevel: function() {this.level++}};
    },
    /**
     * Obtiene mediante recursividad la estadística requerida de un personaje especificado por parámetro.
     * @param obj Objeto en el que buscar la estadística
     * @param name Nombre de la estadística a encontrar
     * @returns {*}
     */
    findStat: function(obj, name) {
        var tmpRet;
        if(util.is(util.stat, obj)) {
            if(obj.name === name) return obj.level;
        } else if(util.is(util.stats, obj) || util.is(util.char, obj)) {
            var self = this, ret;
            obj.stats.forEach(function(o) {
                tmpRet = self.findStat(o, name);
                if(!util.isUndefined(tmpRet)) ret = tmpRet;
            });
            return ret;
        }
    },
    /**
     * Obtiene mediante recursividad el campo de datos requerido de un personaje especificado por parámetro.
     * @param obj Objeto en el que buscar el campo de datos
     * @param name Nombre del campo de datos a encontrar
     * @returns {*}
     */
    findData: function(obj, name) {
        var tmpRet;
        if(util.is(util.field, obj)) {
            if(obj.name === name) {return obj.value;}
        } else {
            var prop, ret, self = this;
            if(util.is(util.data, obj)) prop = 'fields';
            else if(util.is(util.char, obj)) prop = 'data';
            obj[prop].forEach(function(o) {
                tmpRet = self.findData(o, name);
                if(!util.isUndefined(tmpRet)) ret = tmpRet;
            });
            return ret;
        }
    },
    /**
     * Define mediante recursividad el nivel de una estadística del personaje especificados por parámetro.
     * @param obj Objeto en el que definir el nivel de la estadística
     * @param name Nombre de la estadística a redefinir.
     * @param value Nuevo valor de la estadística. Si es boolean, true incrementa el valor y false lo decrementa.
     */
    setStat: function(obj, name, value) {
        if(util.is(util.stat, obj)) {
            if(obj.name === name) util.isBoolean(value) ? value ? obj.level++ : obj.level-- : obj.level = value;
        } else if(util.is(util.stats, obj) || util.is(util.char, obj)) {
            var self = this;
            obj.stats.forEach(function(o) {self.setStat(o, name, value)});
        }
    },
    /**
     * Define mediante recursividad el valor de un campo de datos del personaje especificado por parámetro.
     * @param obj Objeto en el que definir el valor de un campo de datos.
     * @param name Nombre del campo de datos a redefinir.
     * @param value Nuevo valor del campo de datos.
     */
    setData: function(obj, name, value) {
        if(util.is(util.field, obj)) {
            if(obj.name === name) obj.value = value;
        } else {
            var prop, self = this;
            if(util.is(util.data, obj)) prop = 'fields';
            else if(util.is(util.char, obj)) prop = 'data';
            obj[prop].forEach(function(o) {self.setData(o, name, value)});
        }
    }
};
