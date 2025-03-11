document.addEventListener('DOMContentLoaded', function() {
    // スライドショー機能の実装
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dot');
    let currentSlide = 0;
    let slideInterval;

    // スライドショーの自動再生を開始
    function startSlideshow() {
        slideInterval = setInterval(nextSlide, 5000); // 5秒ごとに次のスライドへ
    }

    // 次のスライドへ移動
    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }

    // 特定のスライドへ移動
    function goToSlide(n) {
        // 現在のスライドからactiveクラスを削除
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        // 新しいスライドにactiveクラスを追加
        currentSlide = n;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    // ドットクリックでスライド切り替え
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval); // 自動再生を停止
            goToSlide(index);
            startSlideshow(); // 自動再生を再開
        });
    });

    // スライドショーを開始
    startSlideshow();
});
