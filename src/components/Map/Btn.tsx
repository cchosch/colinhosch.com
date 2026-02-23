
const BTN_WIDTH = 200;
const BTN_HEIGHT = 200;

// const DISPLACEMENT_MAP_URI = "/specular_circle.png";
const DISPLACEMENT_MAP_URI = "/displacement_circle.png";
// const SPECULAR_LIGHTING_URI = "/displacement_circle.png";
const SPECULAR_LIGHTING_URI = "/specular_circle.png";

const ANIMATION_CONFIG = {
  initial: {
    scale: 1,
    displacement: 55,
    blur: 0.8
  },
  hover: {
    scale: 1.08,
    displacement: 125,
    blur: 4
  },
  click: {
    scaleDown: 0.92,
    scaleUp: 1.08
  },
  duration: {
    hover: 0.25,
    clickDown: 0.08,
    clickUp: 0.25
  },
  ease: {
    hover: "back.out(1.4)",
    hoverOut: "power2.out",
    clickDown: "power2.in",
    clickUp: "back.out(2)"
  }
};


const GlassBtn = () => {

    return (
    <>
      <div
        className="relative overflow-hidden shadow-lg w-full rounded-[100px]"
        style={{
          maxWidth: `${BTN_WIDTH}px`,
          minHeight: `${BTN_HEIGHT}px`
        }}
      >
        {/* filters */}
        <div className="absolute inset-0" style={{
            backdropFilter: "url(#liquid-glass-button) brightness(100%)"
        }} />

        {/* HTML Version */}
        <div className="absolute inset-0 inline-flex items-center justify-center font-bold text-white" style={{
            background: "hsl(0 100% 100% / 15%)"
        }}>
            Yello
        </div>
      </div>
      <svg colorInterpolationFilters="sRGB" style={{ display: "none" }}>
        <defs>
          <filter id="liquid-glass-button">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation={ANIMATION_CONFIG.initial.blur}
              result="blurred_source"
            />
            <feImage
              href={DISPLACEMENT_MAP_URI}
              x="0"
              y="0"
              width={BTN_WIDTH}
              height={BTN_HEIGHT}
              result="displacement_map"
            ></feImage>
            <feDisplacementMap
              in="blurred_source"
              in2="displacement_map"
              scale={ANIMATION_CONFIG.initial.displacement}
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feColorMatrix
              in="displaced"
              type="saturate"
              result="displaced_saturated"
              values="150"
            />
            <feImage
              href={SPECULAR_LIGHTING_URI}
              x="0"
              y="0"
              width={BTN_WIDTH}
              height={BTN_HEIGHT}
              result="specular_layer"
            />
            <feGaussianBlur
              in="specular_layer"
              stdDeviation="1"
              result="blurred_specular_layer"
            />
            <feComposite
              in="displaced_saturated"
              in2="blurred_specular_layer"
              operator="in"
              result="final_specular_layer"
            />

            <feBlend in="final_specular_layer" in2="displaced" mode="normal" />
          </filter>
        </defs>
      </svg>
    </>
  );
};

export default GlassBtn;
