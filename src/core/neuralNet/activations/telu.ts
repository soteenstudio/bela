export function telu(
  x: number,
  beta = 1,
  alpha = 0.5,
  gamma = 1
) {
  const sigmoid = 1 / (1 + Math.exp(-beta * x));  // sigmoid(βx)
  const softplus = Math.log(1 + Math.exp(gamma * x)); // softplus(γx), ditune pake gamma
  const mish = Math.tanh(softplus);                 // tanh(softplus)
  
  // Kombinasi linear + nonlinear antara Swish dan Mish
  const combined = alpha * (x * sigmoid) + (1 - alpha) * (x * mish);
  
  // Penyesuaian nonlinear ekstra biar output lebih fleksibel
  return Math.tanh(combined);
}