const sliderImages = [
  "/images/burgers/AmericanCheeseBurger.png",
  "/images/burgers/Rusty-Savage.png",
  "/images/burgers/Juicy-Lucy.png",
  "/images/burgers/PineApple.png",
  "/images/burgers/Tripple-Cheese.png",
];

export function HomeSlider() {
  return (
    <div className="slider-frame">
      <div className="wrapper">
        {sliderImages.map((image) => (
          <img
            key={image}
            className="burger-img"
            src={image}
            alt="Burger image"
          />
        ))}
      </div>
    </div>
  );
}
