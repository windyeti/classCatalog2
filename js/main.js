// //= _partials/basket.js
// //= _partials/review.js
function Container() {
	this.id = '';
	this.className = '';
	this.htmlCode = ''
}
Container.prototype.render = function() {
	return this.htmlCode;
}
// ----------- class Good ------------------
function Good( options ) {
	Container.call(this);

	this.id_product = options.id_product;
	this.price = options.price;
	this.name = options.name;
	this.reviews = options.reviews;
	this.price = options.price;
	this.className = 'good';
	this.htmlCode = '';
}
Good.prototype = Object.create(Container.prototype);
Good.prototype.constructor = Good;

Good.prototype.render = function() {
	var self = this;
	this.$divGood = $('<div>').attr({'id' : 'product_' + this.id_product, 'class' : 'good'});
	this.$divName = $('<div>').attr({'class' : 'product_name'}).text(this.name);
	this.$divPrice = $('<div>').attr({'class' : 'product_price'}).text(this.price + ' руб.');

	this.$divName.appendTo(this.$divGood);
	this.$divPrice.appendTo(this.$divGood);
	this.$buttonBuy = $('<button>').attr({'class' : 'product_button_buy'}).text('Купить');
	this.$buttonBuy.appendTo(this.$divGood);

	this.renderReviews();

	return this.$divGood;
}
Good.prototype.renderReviews = function() {
	var self = this;
	this.$divReviews = $('<div>').attr({'class' : 'product_reviews'}).text('Отзывы');
	this.$divAddNewReview = $('<div>').attr({'class' : 'product_addNewReview'}).text('Добавить отзыв');
	this.$divAddNewReview.appendTo(this.$divReviews);
	// ---- onClick -----------
	this.$divAddNewReview.on('click', function() {
		self.renderModale();
	})
	// ---- end onClick -----------

		$(this.reviews).each(function() {
			var $divReview = $('<div>').attr({'class' : 'product_review'});
			var $spanSubmit = ( $('<span>').attr({'class' : 'product_submit'}).text(this.submit) );
			var $spanAddPlus = ( $('<span>').attr({'class' : 'product_addPlus'}).text('+') );
			var $spanDelete = ( $('<span>').attr({'class' : 'product_delete'}).text('-') );
			var $spanTextAbout = ( $('<span>').attr({'class' : 'product_textAbout'}).text(this.textAbout) );
			$divReview
				.append($spanSubmit)
				.append($spanAddPlus)
				.append($spanDelete)
				.append($spanTextAbout);
			$divReview.appendTo(self.$divReviews);

			$spanDelete.on('click', this, function(e) {
				self.deleteReview( e.data );
			});
			$spanAddPlus.on('click', this, function(e) {
				self.addLike( e.data );
			})
		});
	this.$divReviews.appendTo(this.$divGood);
}
Good.prototype.renderModale = function() {
	var self = this;
	this.$divModale = $('<div>').attr({'class':'modale'}).text('Введите текст отзыва.');
	this.$formModale = $('<form>').attr({'class':'form_modale'})
		.append( $('<input>').attr({'type':'text','class':'input_modale'}) )
		.append( $('<button>').attr({'class':'button_modale'}).text('OK') );

	this.$divModale.append( this.$formModale );
	this.$divModale.appendTo( $('body') );

	this.$divModale.on('click', '.button_modale', function(e) {
		e.preventDefault();
		self.newReviewText = $(this).parent().find('.input_modale').val();
		self.addToReviews();
		self.$divModale.remove();
	})
}
Good.prototype.addToReviews = function() {
	this.reviews.push({
					submit : '0',
					textAbout : this.newReviewText
				});
	this.cleanOldAndRenderReviews();
}
Good.prototype.cleanOldAndRenderReviews = function() {
	this.$divReviews.remove();
	this.renderReviews();
}
Good.prototype.addLike = function( review ) {
	var newSubmit = parseInt(review.submit);
	newSubmit++;
	review.submit = newSubmit;

	this.cleanOldAndRenderReviews();
}
Good.prototype.deleteReview = function( review ) {
	var self = this;
	var ind;
	$(this.reviews).each(function(inx) {
		if(this === review) {
			ind = inx;
		}
	});
	
	this.reviews.splice(ind,1);

	this.cleanOldAndRenderReviews();
}
// --------------- end class Good ---------------

function Catalog() {
	Container.call(this);

	this.id = 'catalogGoods';
	this.goodItems = [];
	this.htmlCode = '';
}
Catalog.prototype = Object.create(Container.prototype);
Catalog.prototype.constructor = Catalog;

Catalog.prototype.getListGoods = function() {
	$.ajax({
		url : 'catalog.json',
		dataType : 'json',
		context : this,
		success : function(data) {
			if( data.result != 1 ) {
				console.log('ошибка в результате');
				return
			}
			var self = this;
			$(data.goods).each(function() {
				self.goodItems.push( new Good( this ) );
			});
			this.render();
		}
	});
}
Catalog.prototype.render = function() {
	this.htmlCode = $('div').attr({'id':this.id});
	var self = this;
	$(this.goodItems).each(function() {
		self.htmlCode.append( this.render() );
	});
}
//# sourceMappingURL=main.js.map
