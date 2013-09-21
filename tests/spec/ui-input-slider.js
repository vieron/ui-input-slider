describe('ui-input-slider', function() {
    var UIInputSlider = require('ui-input-slider');

    beforeEach(function() {
        this.el = document.querySelector('.ui-input-slider');
        this.slider = new UIInputSlider(this.el, {
            max: 200
        });
    });

    afterEach(function() {

    });

    it('should return instance of ui-input-slider', function() {
        expect(this.slider).to.be.an.instanceof(UIInputSlider);
    });

    it('should respondTo init and destroy methods', function() {
        expect(this.slider).to.respondTo('init');
        expect(this.slider).to.respondTo('destroy');
    });

    describe('#val()', function() {
        it('should be 80', function() {
            expect(this.slider.val()).to.equal(80);
        });

        describe('#val(number)', function() {
            it('should be 20', function() {
                this.slider.val(20);
                expect(this.slider.val()).to.equal(20);
            });

            it('should not be greater than 200', function() {
                this.slider.val(220);
                expect(this.slider.val()).to.equal(200);
            });
        });
    });

});
