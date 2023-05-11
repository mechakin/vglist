export const Logo = (props: {size?: number}) => {
  return (
    <svg
      fill="#FFFFFF"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
      width={props.size ? props.size : '50'}
      height={props.size ? props.size : '50'}
      name="logo"
    >
      <path d="M 25 4 C 21.145849 4 18 7.1458524 18 11 C 18 13.780216 19.641042 16.184382 22 17.3125 L 22 18.085938 C 21.630145 18.190812 21.263678 18.309245 20.904297 18.453125 L 2.8359375 25.703125 C 1.6618102 26.174086 0.99237568 27.287364 0.95507812 28.384766 C 0.94811693 28.589584 0.97141302 28.795322 1.0078125 29 L 1 29 L 1 35.255859 C 1 36.023039 1.4435867 36.729267 2.1367188 37.060547 L 17.066406 44.199219 C 22.083517 46.598339 27.916483 46.598339 32.933594 44.199219 L 47.861328 37.060547 C 48.555243 36.729541 49 36.023543 49 35.255859 L 49 29 L 48.992188 29 C 49.028351 28.796049 49.051862 28.590895 49.044922 28.386719 C 49.007622 27.289385 48.337782 26.17465 47.164062 25.703125 L 29.095703 18.453125 L 29.09375 18.453125 C 28.735339 18.309761 28.369483 18.191228 28 18.085938 L 28 17.3125 C 30.358958 16.184382 32 13.780216 32 11 C 32 7.1458524 28.854151 4 25 4 z M 25 6 C 27.773271 6 30 8.2267307 30 11 C 30 13.773269 27.773271 16 25 16 C 22.226729 16 20 13.773269 20 11 C 20 8.2267307 22.226729 6 25 6 z M 24 17.919922 C 24.327598 17.967299 24.659679 18 25 18 C 25.340321 18 25.672402 17.967299 26 17.919922 L 26 28.914062 C 26 29.479094 25.56503 29.914062 25 29.914062 C 24.43497 29.914062 24 29.479094 24 28.914062 L 24 17.919922 z M 22 20.185547 L 22 28.914062 C 22 30.559033 23.35503 31.914064 25 31.914062 C 26.64497 31.914062 28 30.559033 28 28.914062 L 28 20.197266 C 28.116415 20.238452 28.236024 20.262378 28.351562 20.308594 L 46.417969 27.558594 C 46.857251 27.735069 47.031973 28.072208 47.044922 28.453125 C 47.057872 28.834042 46.906873 29.183094 46.480469 29.388672 L 31.080078 36.814453 C 27.237899 38.667399 22.762101 38.667399 18.919922 36.814453 L 3.5175781 29.388672 C 3.0913297 29.183169 2.9401726 28.834223 2.953125 28.453125 C 2.9660774 28.072027 3.1412055 27.734633 3.5800781 27.558594 L 21.648438 20.308594 C 21.764582 20.262094 21.8827 20.227011 22 20.185547 z M 11.5 27 A 3.5 2 0 0 0 11.5 31 A 3.5 2 0 0 0 11.5 27 z M 3 31.357422 L 18.050781 38.615234 C 22.440602 40.732288 27.559398 40.732288 31.949219 38.615234 L 47 31.357422 L 47 35.255859 L 32.072266 42.396484 C 27.599376 44.535364 22.400624 44.535364 17.927734 42.396484 L 3 35.255859 L 3 31.357422 z" />
    </svg>
  );
};