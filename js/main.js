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

	this.id = 'catalog';
	this.className = 'catalog';
	this.goodItems = [];
	this.htmlCode = '';
}
Catalog.prototype = Object.create(Container.prototype);
Catalog.prototype.constructor = Catalog;

Catalog.prototype.render = function(wrapper) {
	this.htmlCode = $('<div>').attr({'id':this.id});
	$.ajax({
		url : 'catalog.json',
		dataType : 'json',
		context : this,
		success : function(data) {
			if( data.result != 1 ) {
				console.log('ошибка в данных с сервера');
				return
			}
			var self = this;
			$(data.goods).each(function() {
				self.goodItems.push( new Good( this ) );
			});
		}
	});
	this.htmlCode.appendTo(wrapper);
}
// ----------- class Good ------------------
function Good( options ) {
	Container.call(this);

	this.id = options.id_product;
	this.price = options.price;
	this.name = options.name;
	this.reviewsAndSubmits = options.reviewsAndSubmits;
	this.objReviewsAndSubmits = new Reviews( this.id, options.reviewsAndSubmits );
	this.className = 'good';
	this.htmlCode = '';

	this.generateMarkup();
}
Good.prototype = Object.create(Container.prototype);
Good.prototype.constructor = Good;

Good.prototype.render = function() {
	this.htmlCode = $('<div>').attr({'id' : 'good_' + this.id, 'class' : 'good'});
	this.htmlCode
		.append( $('<div>').attr({'class' : 'good_name'}).text(this.name) )
		.append( $('<div>').attr({'class' : 'good_price'}).text(this.price + ' руб.') )
		.append( $('<button>').attr({'class' : 'good_button_buy'}).text('Купить') );
	return this.htmlCode;
}
Good.prototype.generateMarkup = function() {
	$('#catalog').append( this.render() );
	this.objReviewsAndSubmits.generateMarkup();
}
// --------------- end class Good ---------------

// ------------- class Reviews -----------------
function Reviews( idProduct, list ) {
	Container.call(this);

	this.id = idProduct;
	this.ArrayObjsReviewAndSubmit = this.makeArrayObjsReviewAndSubmit(list);
	this.className = 'reviews';
	this.htmlCode = '';
}
Reviews.prototype = Object.create(Container.prototype);
Reviews.prototype.constructor = Reviews;

Reviews.prototype.makeArrayObjsReviewAndSubmit = function(list) {
	var result = [];
	$(list).each(function() {
		result.push( new Review( this ) );
	});
	return result
}
Reviews.prototype.generateMarkup = function() {
	var self = this;
	$( '#good_' + this.id ).append( this.render() );
	$(this.ArrayObjsReviewAndSubmit).each(function() {
		this.render(self.id);
	});
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
		self.ArrayObjsReviewAndSubmit[self.ArrayObjsReviewAndSubmit.length] = new Review({
			submit : 0,
			textAbout : self.newReviewText
		});
		self.ArrayObjsReviewAndSubmit[self.ArrayObjsReviewAndSubmit.length - 1].render(self.id);
		$divModale.remove();
	});
}
Reviews.prototype.render = function() {
	var self = this;
	this.htmlCode = $('<div>').attr({'class' : this.className}).text('Отзывы');
	this.htmlCode
		.append( $('<div>').attr({'class' : this.className+'_addNewReview'}).text('Добавить отзыв') );

	this.htmlCode.on('click', '.'+this.className+'_addNewReview', function() {
		self.renderModale();
	});

	this.htmlCode.on('click', '.review_addPlus', function(e) {
		var submitVal = $(this).parent().find('.review_submit').text();
		submitVal++;
		$(this).parent().find('.review_submit').text(submitVal);
	});

	this.htmlCode.on('click', '.review_delete', function(e) {
		$(this).parent().remove();
	});

	return this.htmlCode;
}
// // ------------- end class Reviews -----------------

// // ------------- class Reviews -----------------
function Review( options ) {
	Container.call(this);

	this.submit = options.submit;
	this.textAbout = options.textAbout;
	this.className = 'review';
	this.htmlCode = '';
}
Review.prototype = Object.create(Container.prototype);
Review.prototype.constructor = Review;

Review.prototype.render = function( idProduct ) {
		this.htmlCode = $('<div>').attr({'class' : this.className});
		var $spanSubmit = ( $('<span>').attr({'class' : this.className+'_submit'}).text(this.submit) );
		var $spanAddPlus = ( $('<span>').attr({'class' : this.className+'_addPlus'}).text('+') );
		var $spanDelete = ( $('<span>').attr({'class' : this.className+'_delete'}).text('-') );
		var $spanTextAbout = ( $('<span>').attr({'class' : this.className+'_textAbout'}).text(this.textAbout) );
		this.htmlCode
			.append($spanSubmit)
			.append($spanAddPlus)
			.append($spanDelete)
			.append($spanTextAbout);
	$( '#good_' + idProduct ).find('.reviews').append( this.htmlCode );
}

// // ------------- end class Reviews -----------------
//# sourceMappingURL=main.js.map
