export function telu(
  x: number,
  beta = 1,
  alpha = 0.5,
  gamma = 1
): number {
  // Sigmoid dan turunannya
  const sigmoid = 1 / (1 + Math.exp(-beta * x));
  const sigmoidDeriv = beta * sigmoid * (1 - sigmoid);

  // Softplus dan turunannya
  const expGammaX = Math.exp(gamma * x);
  const softplus = Math.log(1 + expGammaX);
  const softplusDeriv = gamma * (expGammaX / (1 + expGammaX)); // sigmoid(gamma x)

  // Mish dan turunannya
  const mish = Math.tanh(softplus);
  const mishDeriv = (1 - mish * mish) * softplusDeriv;

  // Turunan combined
  const combined = alpha * (x * sigmoid) + (1 - alpha) * (x * mish);
  const combinedDeriv = alpha * (sigmoid + x * sigmoidDeriv) + (1 - alpha) * (mish + x * mishDeriv);

  // Turunan output akhir (tanh)
  const outputDeriv = (1 - Math.pow(Math.tanh(combined), 2)) * combinedDeriv;

  return outputDeriv;
}