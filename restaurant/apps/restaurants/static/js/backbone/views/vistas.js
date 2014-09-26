var app = app || {};

app.mainView = Backbone.View.extend({
	el: '#app',

	events: {
		'keyup #buscador': 'buscarRestaurant'
	},

	initialize: function(){
		app.restaurantsCollection.on('add', this.agregarRestaurant);
		app.restaurantsCollection.fetch();
	},

	agregarRestaurant: function(modelo){
		var vista = new app.restaurantView({model: modelo});
		$('.list-group').append(vista.render().$el);
	},

	buscarRestaurant: function(){
		var cadBuscador = $('#buscador').val().toLowerCase();
		var filtro = app.restaurantsCollection.filter(function(modelo){
			var cadModelo = modelo.get('name').substring(0, cadBuscador.length).toLowerCase();
			if ((cadBuscador === cadModelo) && (cadModelo.length == cadBuscador.length) && 
				(cadBuscador.length != 0) && (cadModelo.length != 0)){
				return modelo;
			}else if(cadModelo.length == 0 && cadBuscador.length == 0){
				return modelo;
			}
		});
		this.agregarFiltro(filtro);
	},

	agregarFiltro: function(coleccionFiltro){
		this.$('.list-group').html('');
		coleccionFiltro.forEach(this.agregarRestaurant, this);
	}
}); 

app.restaurantView = Backbone.View.extend({
	template: _.template($('#tplRestaurant').html()),

	render: function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});