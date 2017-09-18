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
// ------------- Catalog ------------------
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
// ----------- class Good ------------------
function Good( options ) {
	Container.call(this);

	this.id_product = options.id_product;
	this.price = options.price;
	this.name = options.name;
	this.reviewsAndSubmit = options.reviews;
	this.className = 'good';
	this.htmlCode = '';
}
Good.prototype = Object.create(Container.prototype);
Good.prototype.constructor = Good;

Good.prototype.render = function() {
	var self = this;
	var $divGood = $('<div>').attr({'id' : 'product_' + this.id_product, 'class' : 'good'});
	$divGood
		.append( $('<div>').attr({'class' : 'product_name'}).text(this.name) )
		.append( $('<div>').attr({'class' : 'product_price'}).text(this.price + ' руб.') )
		.append( $('<button>').attr({'class' : 'product_button_buy'}).text('Купить') );

	var reviews = new Reviews( this.reviewsAndSubmit );
	reviews.render( $divGood );

	return $divGood;

}
// --------------- end class Good ---------------

// ------------- class Reviews -----------------
function Reviews( list ) {
	Container.call(this);

	this.reviewsAndSubmit = list;
	this.reviewsAndSubmitArray = [];
	this.$goodToChangeReviews = '';
	this.$divReviews = '';
	this.className = 'reviews';
	this.htmlCode = '';
}
Reviews.prototype = Object.create(Container.prototype);
Reviews.prototype.constructor = Reviews;

Reviews.prototype.render = function( thisGood ) {
	var self = this;
	this.$goodToChangeReviews = thisGood;
	this.$divReviews = $('<div>').attr({'class' : this.className}).text('Отзывы');
	this.$divReviews
		.append( $('<div>').attr({'class' : this.className+'_addNewReview'}).text('Добавить отзыв') );

	$(this.reviewsAndSubmit).each(function() {
		self.reviewsAndSubmitArray.push( new Review( this ) );
	});

	$(this.reviewsAndSubmitArray).each(function() {
		this.render( self.$divReviews );
	})

	// ---- onClick -----------

	this.$divReviews.on('click', '.'+this.className+'_addNewReview', function(e) {
		self.renderModale();
	});

	this.$divReviews.on('click', '.review_addPlus', function(e) {
		var indReview = '';
		var $divReview = $(e.target).parent();
		var $divReviews = $(e.target).parent().parent();
		$divReviews.find('.review').filter(function(ind) {
			if ( $(this).get(0) == $divReview.get(0) ) {
				indReview = ind;
				return;
			}
		});
		self.addLike( indReview );
	});

	this.$divReviews.on('click', '.review_delete', function(e) {
		var indReview = '';
		var $divReview = $(e.target).parent();
		var $divReviews = $(e.target).parent().parent();
		$divReviews.find('.review').filter(function(ind) {
			if ( $(this).get(0) == $divReview.get(0) ) {
				indReview = ind;
				return;
			}
		});
		self.deleteReview( indReview );
	});
	// ---- end onClick -----------

	thisGood.append( this.$divReviews );

}
Reviews.prototype.deleteReview = function( indReview ) {
	this.reviewsAndSubmit.splice(indReview,1);
	this.cleanOldAndRenderReviews();
}
Reviews.prototype.addLike = function( indReview ) {
	this.reviewsAndSubmit[ indReview ].submit++;
	this.cleanOldAndRenderReviews();
}
Reviews.prototype.renderModale = function() {
	var self = this;
	var $divModale = $('<div>').attr({'class':'modale'}).text('Введите текст отзыва.');
	var $formModale = $('<form>').attr({'class':'form_modale'})
			.append( $('<input>').attr({'type':'text','class':'input_modale'}) )
			.append( $('<button>').attr({'class':'button_modale'}).text('OK') );

	$divModale.append( $formModale );
	$divModale.appendTo( $('body') );

	$divModale.on('click', '.button_modale', function(e) {
		e.preventDefault();
		self.newReviewText = $(this).parent().find('.input_modale').val();
		self.addToReviews();
		$divModale.remove();
	})
}
Reviews.prototype.addToReviews = function() {
	this.reviewsAndSubmit.push({
		"submit" : "0",
		"textAbout" : this.newReviewText
	});
	this.cleanOldAndRenderReviews();
}
Reviews.prototype.cleanOldAndRenderReviews = function() {
	// очистим массив, из которого делаются отзывы
	this.reviewsAndSubmitArray = [];
	// очистим div, в котором визуализируется отзывы
	this.$divReviews.remove();
	this.render( this.$goodToChangeReviews );
}
// ------------- end class Reviews -----------------

// ------------- class Reviews -----------------
function Review( options ) {
	Container.call(this);

	this.submit = options.submit;
	this.textAbout = options.textAbout;
	this.className = 'review';
	this.htmlCode = '';
}
Review.prototype = Object.create(Container.prototype);
Review.prototype.constructor = Review;

Review.prototype.render = function( thisReviews ) {
		var $divReview = $('<div>').attr({'class' : this.className});
		var $spanSubmit = ( $('<span>').attr({'class' : this.className+'_submit'}).text(this.submit) );
		var $spanAddPlus = ( $('<span>').attr({'class' : this.className+'_addPlus'}).text('+') );
		var $spanDelete = ( $('<span>').attr({'class' : this.className+'_delete'}).text('-') );
		var $spanTextAbout = ( $('<span>').attr({'class' : this.className+'_textAbout'}).text(this.textAbout) );
		$divReview
			.append($spanSubmit)
			.append($spanAddPlus)
			.append($spanDelete)
			.append($spanTextAbout);
		$divReview.appendTo( thisReviews );
}

// ------------- end class Reviews -----------------
//# sourceMappingURL=main.js.map
