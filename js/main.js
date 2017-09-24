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
// // ------------- Catalog ------------------
function Catalog() {
	Container.call(this);

	this.id = 'catalog';
	this.className = 'catalog';
	this.goodItems = [];
	this.htmlCode = '';

	this.makeGoodItems();
}
Catalog.prototype = Object.create(Container.prototype);
Catalog.prototype.constructor = Catalog;

Catalog.prototype.makeGoodItems = function() {
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
			$(this.goodItems).each(function() {
				this.generateMarkup();
			});
		}
	});
}

Catalog.prototype.render = function() {
	this.htmlCode = $('<div>').attr({'id':this.id});
	this.htmlCode.append( $('<div>').text('Каталог') );
	return this.htmlCode;
}
// // ----------- class Good ------------------
function Good( options ) {
	Container.call(this);

	this.id = options.id_product;
	this.price = options.price;
	this.name = options.name;
	this.objReviewsAndSubmits = new Reviews( this.id, options.reviewsAndSubmits );
	this.className = 'good';
	this.htmlCode = '';
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
// // --------------- end class Good ---------------
// // ------------- class Reviews -----------------
function Reviews( idProduct, list ) {
	Container.call(this);

	this.id = idProduct;
	this.ArrayObjsReviewAndSubmit = this.makeArrayObjsReviewAndSubmit(list);
	this.className = 'reviews';
	this.htmlCode = '';
	this.reviewsBlockHtmlCode = '';
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
	if (!this.htmlCode)
		$( '#good_' + this.id ).append( this.render() );
	this.htmlCode.append( this.generateBlockReviews() );	
}
Reviews.prototype.generateBlockReviews = function() {
	if (!this.reviewsBlockHtmlCode)
		this.reviewsBlockHtmlCode = $('<div>');
	var result = $('<div>');
	$(this.ArrayObjsReviewAndSubmit).each(function() {
		this.render().appendTo( result );
	});
	this.reviewsBlockHtmlCode.html(result);
	return this.reviewsBlockHtmlCode
}
Reviews.prototype.renderModale = function() {
	var self = this;
	var $divModale = $('<div>').attr({'class':'modale'}).text('Введите текст отзыва.');
	var $formModale = $('<form>').attr({'class':'form_modale'})
			.append( $('<input>').attr({'type':'text','class':'input_modale','autofocus':'autofocus'}) )
			.append( $('<button>').attr({'class':'button_modale'}).text('OK') );

	$divModale.append( $formModale );
	$divModale.appendTo( $('body') );

	$divModale.on('click', '.button_modale', function(e) {
		e.preventDefault();
		self.newReviewText = $(this).parent().find('.input_modale').val();
		self.ArrayObjsReviewAndSubmit[ self.ArrayObjsReviewAndSubmit.length ] = new Review({
			submit : 0,
			textAbout : self.newReviewText
		});
		self.generateBlockReviews();
		$divModale.remove();
	});
}
Reviews.prototype.render = function() {
	var self = this;
	this.htmlCode = $('<div>').attr({'class' : this.className}).text('Отзывы');
	this.htmlCode
		.append( $('<div>').attr({'class' : this.className+'_addNewReview'}).text('Добавить отзыв') );
// ---------- on -------
	this.htmlCode.on('click', '.'+this.className+'_addNewReview', function() {
		self.renderModale();
	});

	this.htmlCode.on('click', '.review_addPlus', this.ArrayObjsReviewAndSubmit, function(e) {
		var $divReview = $(e.target).parent();
		var $divReviews = $(e.target).parent().parent();
		$divReviews.find('.review').filter(function(ind) {
			if ( $(this).get(0) == $divReview.get(0) ) {
				var reviewCurrent = e.data[ind];
				var submitNum = reviewCurrent.$spanSubmit.text();
				submitNum++;
				reviewCurrent.$spanSubmit.text( submitNum );
				return
			}
		});
	});

	this.htmlCode.on('click', '.review_delete', this, function(e) {
		var $divReview = $(e.target).parent();
		var $divReviews = $(e.target).parent().parent();
		$divReviews.find('.review').filter(function(ind) {
			if ( $(this).get(0) == $divReview.get(0) ) {
				e.data.ArrayObjsReviewAndSubmit.splice([ind],1);
				e.data.generateMarkup();
				return
			}
		});
	});
// ---------- end on -------
	return this.htmlCode;
}
// // // ------------- end class Reviews -----------------

// // // ------------- class Reviews -----------------
function Review( options ) {
	Container.call(this);

	this.submit = options.submit;
	this.textAbout = options.textAbout;
	this.className = 'review';
	this.htmlCode = '';
}
Review.prototype = Object.create(Container.prototype);
Review.prototype.constructor = Review;

Review.prototype.render = function(codeAction) {
	this.htmlCode = $('<div>').attr({'class' : this.className});
	this.$spanSubmit = $('<span>').attr({'class' : this.className+'_submit'}).text(this.submit);
	this.$spanAddPlus = $('<span>').attr({'class' : this.className+'_addPlus'}).text('+');
	this.$spanDelete = $('<span>').attr({'class' : this.className+'_delete'}).text('-');
	this.$spanTextAbout = $('<span>').attr({'class' : this.className+'_textAbout'}).text(this.textAbout);
	this.htmlCode
		.append(this.$spanSubmit)
		.append(this.$spanAddPlus)
		.append(this.$spanDelete)
		.append(this.$spanTextAbout);

	return this.htmlCode;
}	
// // // ------------- end class Reviews -----------------
//# sourceMappingURL=main.js.map
