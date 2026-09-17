import type { Referencia } from '../engine/types'

// Biblioteca curada de referências reais (nenhuma inventada). Chaves curtas
// são usadas pelo catálogo de técnicas e pelo motor de diagnóstico.

export const REFERENCIAS: Record<string, Referencia> = {
  molnar2022: { autores: 'Molnar, C.', ano: '2022', titulo: 'Interpretable Machine Learning: A Guide for Making Black Box Models Explainable (2ª ed.)', veiculo: 'Publicação independente, christophm.github.io/interpretable-ml-book' },
  biecek2021: { autores: 'Biecek, P. & Burzykowski, T.', ano: '2021', titulo: 'Explanatory Model Analysis', veiculo: 'Chapman & Hall/CRC' },
  esl2009: { autores: 'Hastie, T., Tibshirani, R. & Friedman, J.', ano: '2009', titulo: 'The Elements of Statistical Learning (2ª ed.)', veiculo: 'Springer' },
  wood2017: { autores: 'Wood, S. N.', ano: '2017', titulo: 'Generalized Additive Models: An Introduction with R (2ª ed.)', veiculo: 'CRC Press' },
  cart1984: { autores: 'Breiman, L., Friedman, J., Olshen, R. & Stone, C.', ano: '1984', titulo: 'Classification and Regression Trees', veiculo: 'Wadsworth' },
  rudin2019: { autores: 'Rudin, C.', ano: '2019', titulo: 'Stop explaining black box machine learning models for high stakes decisions and use interpretable models instead', veiculo: 'Nature Machine Intelligence, 1(5)' },
  lou2013: { autores: 'Lou, Y., Caruana, R., Gehrke, J. & Hooker, G.', ano: '2013', titulo: 'Accurate intelligible models with pairwise interactions', veiculo: 'Proceedings of the 19th ACM SIGKDD (KDD)' },
  nori2019: { autores: 'Nori, H., Jenkins, S., Koch, P. & Caruana, R.', ano: '2019', titulo: 'InterpretML: A Unified Framework for Machine Learning Interpretability', veiculo: 'arXiv:1909.09223' },
  lundberg2017: { autores: 'Lundberg, S. M. & Lee, S.-I.', ano: '2017', titulo: 'A Unified Approach to Interpreting Model Predictions', veiculo: 'Advances in Neural Information Processing Systems 30 (NeurIPS)' },
  lundberg2020: { autores: 'Lundberg, S. M. et al.', ano: '2020', titulo: 'From local explanations to global understanding with explainable AI for trees', veiculo: 'Nature Machine Intelligence, 2(1)' },
  ribeiro2016: { autores: 'Ribeiro, M. T., Singh, S. & Guestrin, C.', ano: '2016', titulo: '"Why Should I Trust You?": Explaining the Predictions of Any Classifier', veiculo: 'Proceedings of the 22nd ACM SIGKDD (KDD)' },
  ribeiro2018: { autores: 'Ribeiro, M. T., Singh, S. & Guestrin, C.', ano: '2018', titulo: 'Anchors: High-Precision Model-Agnostic Explanations', veiculo: 'Proceedings of the AAAI Conference on Artificial Intelligence, 32(1)' },
  breiman2001: { autores: 'Breiman, L.', ano: '2001', titulo: 'Random Forests', veiculo: 'Machine Learning, 45(1)' },
  fisher2019: { autores: 'Fisher, A., Rudin, C. & Dominici, F.', ano: '2019', titulo: 'All Models are Wrong, but Many are Useful: Learning a Variable’s Importance by Studying an Entire Class of Prediction Models Simultaneously', veiculo: 'Journal of Machine Learning Research, 20(177)' },
  strobl2007: { autores: 'Strobl, C., Boulesteix, A.-L., Zeileis, A. & Hothorn, T.', ano: '2007', titulo: 'Bias in random forest variable importance measures: Illustrations, sources and a solution', veiculo: 'BMC Bioinformatics, 8, 25' },
  strobl2008: { autores: 'Strobl, C., Boulesteix, A.-L., Kneib, T., Augustin, T. & Zeileis, A.', ano: '2008', titulo: 'Conditional variable importance for random forests', veiculo: 'BMC Bioinformatics, 9, 307' },
  hooker2021: { autores: 'Hooker, G., Mentch, L. & Zhou, S.', ano: '2021', titulo: 'Unrestricted permutation forces extrapolation: variable importance requires at least one more model, or there is no free variable importance', veiculo: 'Statistics and Computing, 31(6)' },
  friedman2001: { autores: 'Friedman, J. H.', ano: '2001', titulo: 'Greedy Function Approximation: A Gradient Boosting Machine', veiculo: 'Annals of Statistics, 29(5)' },
  goldstein2015: { autores: 'Goldstein, A., Kapelner, A., Bleich, J. & Pitkin, E.', ano: '2015', titulo: 'Peeking Inside the Black Box: Visualizing Statistical Learning with Plots of Individual Conditional Expectation', veiculo: 'Journal of Computational and Graphical Statistics, 24(1)' },
  apley2020: { autores: 'Apley, D. W. & Zhu, J.', ano: '2020', titulo: 'Visualizing the effects of predictor variables in black box supervised learning models', veiculo: 'Journal of the Royal Statistical Society: Series B, 82(4)' },
  wachter2018: { autores: 'Wachter, S., Mittelstadt, B. & Russell, C.', ano: '2018', titulo: 'Counterfactual Explanations without Opening the Black Box: Automated Decisions and the GDPR', veiculo: 'Harvard Journal of Law & Technology, 31(2)' },
  mothilal2020: { autores: 'Mothilal, R. K., Sharma, A. & Tan, C.', ano: '2020', titulo: 'Explaining machine learning classifiers through diverse counterfactual explanations', veiculo: 'Proceedings of the 2020 Conference on Fairness, Accountability, and Transparency (FAT*)' },
  selvaraju2017: { autores: 'Selvaraju, R. R. et al.', ano: '2017', titulo: 'Grad-CAM: Visual Explanations from Deep Networks via Gradient-Based Localization', veiculo: 'Proceedings of the IEEE International Conference on Computer Vision (ICCV)' },
  sundararajan2017: { autores: 'Sundararajan, M., Taly, A. & Yan, Q.', ano: '2017', titulo: 'Axiomatic Attribution for Deep Networks', veiculo: 'Proceedings of the 34th International Conference on Machine Learning (ICML)' },
  zeiler2014: { autores: 'Zeiler, M. D. & Fergus, R.', ano: '2014', titulo: 'Visualizing and Understanding Convolutional Networks', veiculo: 'European Conference on Computer Vision (ECCV)' },
  kim2018: { autores: 'Kim, B. et al.', ano: '2018', titulo: 'Interpretability Beyond Feature Attribution: Quantitative Testing with Concept Activation Vectors (TCAV)', veiculo: 'Proceedings of the 35th International Conference on Machine Learning (ICML)' },
  adebayo2018: { autores: 'Adebayo, J. et al.', ano: '2018', titulo: 'Sanity Checks for Saliency Maps', veiculo: 'Advances in Neural Information Processing Systems 31 (NeurIPS)' },
  jain2019: { autores: 'Jain, S. & Wallace, B. C.', ano: '2019', titulo: 'Attention is not Explanation', veiculo: 'Proceedings of NAACL-HLT 2019' },
  lapuschkin2019: { autores: 'Lapuschkin, S. et al.', ano: '2019', titulo: 'Unmasking Clever Hans predictors and assessing what machines really learn', veiculo: 'Nature Communications, 10, 1096' },
  kaufman2012: { autores: 'Kaufman, S., Rosset, S., Perlich, C. & Stitelman, O.', ano: '2012', titulo: 'Leakage in data mining: Formulation, detection, and avoidance', veiculo: 'ACM Transactions on Knowledge Discovery from Data, 6(4)' },
  alvarez2018: { autores: 'Alvarez-Melis, D. & Jaakkola, T. S.', ano: '2018', titulo: 'On the Robustness of Interpretability Methods', veiculo: 'arXiv:1806.08049' },
  krishna2022: { autores: 'Krishna, S. et al.', ano: '2022', titulo: 'The Disagreement Problem in Explainable Machine Learning: A Practitioner’s Perspective', veiculo: 'arXiv:2202.01602' },
  visani2022: { autores: 'Visani, G., Bagli, E., Chesani, F., Poluzzi, A. & Capuzzo, D.', ano: '2022', titulo: 'Statistical stability indices for LIME: Obtaining reliable explanations for machine learning models', veiculo: 'Journal of the Operational Research Society, 73(1)' },
  slack2020: { autores: 'Slack, D., Hilgard, S., Jia, E., Singh, S. & Lakkaraju, H.', ano: '2020', titulo: 'Fooling LIME and SHAP: Adversarial Attacks on Post hoc Explanation Methods', veiculo: 'Proceedings of the AAAI/ACM Conference on AI, Ethics, and Society (AIES)' },
  miller2019: { autores: 'Miller, T.', ano: '2019', titulo: 'Explanation in artificial intelligence: Insights from the social sciences', veiculo: 'Artificial Intelligence, 267' },
  poursabzi2021: { autores: 'Poursabzi-Sangdeh, F. et al.', ano: '2021', titulo: 'Manipulating and Measuring Model Interpretability', veiculo: 'Proceedings of the 2021 CHI Conference on Human Factors in Computing Systems' },
  bird2020: { autores: 'Bird, S. et al.', ano: '2020', titulo: 'Fairlearn: A toolkit for assessing and improving fairness in AI', veiculo: 'Microsoft, Technical Report MSR-TR-2020-32' },
  lgpd2018: { autores: 'Brasil', ano: '2018', titulo: 'Lei nº 13.709, de 14 de agosto de 2018 — Lei Geral de Proteção de Dados Pessoais (LGPD), art. 20', veiculo: 'Diário Oficial da União' },
}

export function resolverReferencias(chaves: string[]): Referencia[] {
  const vistas = new Set<string>()
  const lista: Referencia[] = []
  for (const chave of chaves) {
    if (vistas.has(chave) || !REFERENCIAS[chave]) continue
    vistas.add(chave)
    lista.push(REFERENCIAS[chave])
  }
  return lista
}
