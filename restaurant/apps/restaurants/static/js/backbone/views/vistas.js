var app = app || {};

app.mainView = Backbone.View.extend({
	el: '#app',

	events: {
		'keyup #buscador': 'buscarRestaurant',
		'click #ciudad a': 'selectCiudad',
		'click .categoria': 'selectCategoria',
		'click .pago': 'selectPago'
	},

	selectCiudad: function(ev){
		window.ciudad = $(ev.target).attr('id');
		app.restaurantCiudad = Backbone.Model.extend({
			urlRoot: 'api/ciudades/' + window.ciudad + '/restaurants'
		});
		var restaurantCiudades = Backbone.Collection.extend({
			model: app.restaurantCiudad,
			url: '/api/ciudades/' + window.ciudad + '/restaurants/'
		});
		app.restaurantCiudadesCollection = new restaurantCiudades();
	},

	selectCategoria: function(ev){
		window.categoria = $(ev.target).attr('id');
		app.restaurantCategoria = Backbone.Model.extend({
			urlRoot: 'api/categoria/' + window.categoria + '/restaurants'
		});
		var restaurantCategorias = Backbone.Collection.extend({
			model: app.restaurantCategoria,
			url: '/api/categoria/' + window.categoria + '/restaurants/'
		});
		app.restaurantCategoriasCollection = new restaurantCategorias();
	},

	selectPago: function(ev){
		window.pago = $(ev.target).attr('id');
		app.restaurantPago = Backbone.Model.extend({
			urlRoot: 'api/payments/' + window.pago + '/restaurants'
		});
		var restaurantPagos = Backbone.Collection.extend({
			model: app.restaurantPago,
			url: '/api/payments/' + window.pago + '/restaurants/'
		});
		app.restaurantPagosCollection = new restaurantPagos();
	},

	initialize: function(){
		app.restaurantsCollection.on('add', this.agregarRestaurantFiltro);
		app.restaurantsCollection.fetch();
		this.llegoFinal();
	},

	agregarRestaurant: function(modelo){
		var vista = new app.restaurantView({model: modelo});
		$('.list-group').append(vista.render().$el);
	},

	agregarRestaurantFiltro: function(modelo){
		if((window.cantidad>=modelo.get('id'))&&(window.cantidad-5 < modelo.get('id'))){
			var vista = new app.restaurantView({model: modelo});
			$('.list-group').append(vista.render().$el);
		}
	},

	filtroCiudad: function(){
		var self = this;
		app.restaurantCiudadesCollection.fetch({success: function(ciudades){
			ciudades.each(self.agregarRestaurant, self);
		}});
	},

	filtroCategoria: function(){
		var self = this;
		app.restaurantCategoriasCollection.fetch({success: function(categorias){
			categorias.each(self.agregarRestaurant, self)
		}});
	},

	filtroPago: function(){
		var self = this;
		app.restaurantPagosCollection.fetch({succes: function(pagos){
			pagos.each(self.agregarRestaurant, self);
		}});
	},


	buscarRestaurant: function(){
		window.stade = true;
		var cadBuscador = $('#buscador').val().toLowerCase();
		var filtro = app.restaurantsCollection.filter(function(modelo){
			var cadModelo = modelo.get('name').substring(0, cadBuscador.length).toLowerCase();
			if ((cadBuscador === cadModelo) && (cadModelo.length == cadBuscador.length) && 
				(cadBuscador.length != 0) && (cadModelo.length != 0)){
				return modelo;
			}else if(cadModelo.length == 0 && cadBuscador.length == 0){
				window.stade = false;
				return modelo;
			}
		});
		this.agregarFiltro(filtro);
	},

	agregarFiltro: function(coleccionFiltro){
		this.$('.list-group').html('');
		if(window.stade === false){
			coleccionFiltro = coleccionFiltro.filter(function(modelo){
				if(window.cantidad >= modelo.get('id')){
					return modelo;
				}
			});
		}
		coleccionFiltro.forEach(this.agregarRestaurant, this);
	},

	llegoFinal: function(){
		var self = this;
		$(window).scroll(function(){
			if($(window).height() + $(window).scrollTop() == $(document).height()) {
				if(window.stade === false){
					window.cantidad = window.cantidad + 5;
					app.restaurantsCollection.each(self.agregarRestaurantFiltro, self);
				}
			}
		});
	}
}); 

app.restaurantView = Backbone.View.extend({
	template: _.template($('#tplRestaurant').html()),

	render: function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});