var app = {};
app.base = "robotz";

app.pokedex = [];

app.Pokemon = function (name, type) {
    this.name = name;
    this.type = type;
};
app.Pokemon.prototype.editing = false;

app.urlHelper = function (base) {
    var url = "https://" + base + ".firebaseio.com/"
    for (var i = 1; i < arguments.length; i++) {
        url += arguments[i] + "/"
    }
    return url + ".json";
}

app.ajax = function (method, url, data, success, error) {
    var request = new XMLHttpRequest();
    request.open(method, url);
    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            success(JSON.parse(this.response));
        } else {
            console.log("Error on " + method);
            error();
        }
    };
    request.onerror = function () {
        console.log("Communication error");
        error();
    }
    if (data) {
        request.send(JSON.stringify(data));
    } else {
        request.send();
    }
};

app.create = function () {
    var name = document.getElementById("name").value;
    var type = document.getElementById("type").value;
    var pokemon = new app.Pokemon(name, type);
    app.ajax("POST", app.urlHelper(app.base, "pokedex"), pokemon, function () {
        app.read();
    });
};
app.read = function () {
    app.pokedex = [];
    app.ajax("GET", app.urlHelper(app.base, "pokedex"), null, function (data) {
        for (var i in data) {
            var pokemon = new app.Pokemon(data[i].name, data[i].type);
            pokemon.key = i;
            app.pokedex.push(pokemon);
        }
        app.output();
    })
};
app.edit = function (index) {
    for (var i in app.pokedex) {
        app.pokedex[i].editing = false;
    }
    app.pokedex[index].editing = true;
    app.output();
};
app.save = function (index) {
    var name = document.getElementById("editName").value;
    var type = document.getElementById("editType").value;
    var pokemon = new app.Pokemon(name, type);
    app.ajax("PUT", app.urlHelper(app.base, "pokedex", app.pokedex[index].key), pokemon, function(){
        app.read();
    });
};
app.delete = function (index) {
    //var request = new XMLHttpRequest();
    //request.open("DELETE", app.urlHelper(app.base, "pokedex", app.pokedex[index].key));
    //request.onload = function () {
    //    if (this.status >= 200 && this.status < 400) {
    //        app.read();
    //    }
    //};
    //request.error = function () {
    //    console.log("Error on DELETE");
    //}
    //request.send();
    app.ajax("DELETE", app.urlHelper(app.base, "pokedex", app.pokedex[index].key), null,
        function () {
            app.read();
        });
};
app.getIcon = function (type) {
    if (type === 'fire') {
        return "fa fa-fire fa-2x";
    } else if (type === 'water') {
        return "fa fa-tint fa-2x";
    } else if (type === 'electric') {
        return "fa fa-bolt fa-2x";
    } else if (type === 'grass') {
        return "fa fa-tree fa-2x";
    } else {
        return "fa fa-eye fa-2x";
    }
};
app.output = function () {
    var h = '<div class="container">';
    var type = '';
    h += '<div class="row">';
    for (var i in app.pokedex) {
        
        h += '<div class="col-md-3">';
        if (app.pokedex[i].editing) {
            type = app.pokedex[i].type;
            h += '<input type="text" id="editName" class="form-control" value="'+ app.pokedex[i].name +'"/>';
            h += '<select id="editType" class="input-sm form-control" >';
            h += '<option value="electric">Electric</option>';
            h += '<option value="grass">Grass</option>';
            h += '<option value="water">Water</option>';
            h += '<option value="fire">Fire</option>';
            h += '<option value="ghost">Ghost</option>';
            h += '</select>';
            h += '<div class="btn btn-success btn-sm form-control" onclick="app.save(' + i + ')"><i class="fa fa-save"></i></div>';

        } else {
            h += '<h3 style="text-align: center">' + app.pokedex[i].name + '</h3>';
            h += '<h3 style="text-align: center"><i class="' + app.getIcon(app.pokedex[i].type) + '"></i></h3>';
            h += '<div class="btn btn-warning btn-sm form-control" onclick="app.edit(' + i + ')"><i class="fa fa-edit"></i></div>';
        }
        h += '<div class="btn btn-danger btn-sm form-control" onclick="app.delete(' + i + ')"><span class="glyphicon glyphicon-eject"></span></div>';
        h += '</div>';
    }
    h += '</div>';
    h += '</div>';
    document.getElementById("draw-table").innerHTML = h;
    document.getElementById("editType").value = type;
};

app.read();