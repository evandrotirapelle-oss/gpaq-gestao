// utils/templatesReais.ts

// --- LINKS PÚBLICOS DAS LOGOS ---
const LOGO_FUNEAS_URL = "http://pr.avasus.ufrn.br/pluginfile.php/1/instituicao/foto/17/Logo%20funeas.png";
const LOGO_GOVERNO_URL = "https://www.saude.pr.gov.br/sites/default/arquivos_restritos/files/imagem/2020-05/brasao_sesa.png";

// 1. CONFIGURAÇÃO DE ESTILO
export const CSS_PADRAO = `
  <style>
    @page Section1 {
        size: 595.3pt 841.9pt;
        /* Margem superior de 3cm para dar espaço ao cabeçalho não invadir o texto */
        margin: 3.0cm 2.0cm 2.0cm 2.0cm; 
        
        mso-header-margin: 0.75cm;
        mso-footer-margin: 0.3cm;
        
        mso-header: h1;
        mso-footer: f1;
    }
    
    div.Section1 { page: Section1; }

    body { font-family: 'Arial', sans-serif; font-size: 11pt; line-height: 1.5; color: #000; }
    
    /* Tabelas de Dados */
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 9pt; mso-table-layout-alt: fixed; }
    th, td { border: 1px solid #000; padding: 1px; text-align: center; vertical-align: middle; }
    th { background-color: #f0f0f0; font-weight: bold; }
    
    /* Tabelas de Layout (Sem borda) */
    table.no-border, table.no-border td { border: none !important; padding: 0; }

    .text-justify { text-align: justify; }
    p { margin: 0 0 10px 0; }
    .indent { text-indent: 1.5cm; }
    .bold { font-weight: bold; }
    
    .signature-block { margin-top: 50px; display: flex; justify-content: space-around; page-break-inside: avoid; }
    .signature { text-align: center; width: 40%; font-size: 10pt; border-top: 1px solid #000; padding-top: 5px; }

    /* Oculta definições de cabeçalho do fluxo normal */
    div#h1, div#f1 { display: none; }
  </style>
`;

// 2. CONTEÚDO DO CABEÇALHO (TÉCNICA DE TABELA FLUTUANTE)
export const WORD_HEADER_CONTENT = `
  <div style='mso-element:header' id=h1>
    <table class="no-border" width="100%" style="width:100%; border:none; border-bottom: 2px solid #004a80; margin-bottom: 10px;">
      <tr>
        <td align="left" valign="top" style="text-align: left;">
           <img src="${LOGO_FUNEAS_URL}" width="120" height="50" alt="FUNEAS" />
        </td>
        <td align="right" valign="top" style="text-align: right;">
           <img src="${LOGO_GOVERNO_URL}" width="120" height="50" alt="Governo PR" />
        </td>
      </tr>
    </table>
    <div style='mso-special-character:line-break'></div>
  </div>
`;

// 3. CONTEÚDO DO RODAPÉ
export const WORD_FOOTER_CONTENT = `
  <div style='mso-element:footer' id=f1>
    <div style="border-top: 1px solid #ccc; padding-top: 2px; font-size: 8pt; text-align: center; color: #666; width: 100%;">
      <p style="margin:0;">Rua do Rosário, 144 - 10º andar - Centro - Curitiba - PR - CEP: 80.020-110</p>
      <p style="margin:0;">Tel.: (41) 3798-5373 | www.funeas.pr.gov.br</p>
      <p style="margin:0; text-align: right;">Página <span style='mso-field-code: PAGE '></span> de <span style='mso-field-code: NUMPAGES '></span></p>
    </div>
  </div>
`;

// --- TEMPLATE 1: MOTIVAÇÃO DO ATO ---
export const TEMPLATE_MOTIVACAO = `
  <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head>
    <meta charset="utf-8">
    ${CSS_PADRAO}
    <xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml>
  </head>
  <body lang=PT-BR>
    <div style="display:none;">
        ${WORD_HEADER_CONTENT}
        ${WORD_FOOTER_CONTENT}
    </div>

    <div class=Section1>
      <h3 style="text-align: center; text-decoration: underline; margin-bottom: 20px;">MOTIVAÇÃO DO ATO</h3>
      
      <div class="text-justify">
        <p class="indent">Trata-se de Processo Administrativo de <strong>{{ assunto_memo }}</strong>, por meio de Ata de Registro de Preço do Processo nº <strong>{{ pe_numero }}</strong> para atender a demanda da Fundação Estatal de Atenção em Saúde do Paraná – FUNEAS, pelo período de 12 meses.</p>
        
        <p class="bold" style="margin-top: 15px;">DA LEGITIMIDADE</p>
        <p class="indent">A FUNDAÇÃO ESTATAL DE ATENÇÃO EM SAÚDE DO ESTADO DO PARANÁ - FUNEAS é uma Fundação pública com personalidade jurídica de direito privado, sem fins lucrativos, de beneficência social, de interesse e de utilidade pública.</p>
        <p class="indent">A FUNEAS integra a administração pública Indireta do Estado do Paraná e vincula-se à Secretaria de Estado da Saúde (SESA), tendo por finalidade desenvolver e executar ações e serviços de saúde nas Unidades próprias, sendo elas: Hospital Regional de Guaraqueçaba (HRG), Hospital Regional do Litoral (HRL), Hospital Infantil Waldemar Monastier (HIWM), Hospital Regional do Sudoeste Walter Alberto Pecoits (HRSWAP), Hospital Regional do Norte Pioneiro (HRNP), Hospital Dermatológico Sanitário do Paraná (HDSPR), Centro de Produção e Pesquisa de Imunobiológicos (CPPI), Escola de Saúde Pública do Paraná (ESPP), Hospital Zona Norte de Londrina (HZN), Hospital Zonal Sul de Londrina (HZS), Hospital Regional de Ivaiporã (HRIV), Hospital Regional do Centro Oeste (HRCO), Hospital Regional de Telêmaco Borba (HRTB) e Hospital Adauto Botelho (HAB).</p>
        <p class="indent">A fundamentação legal está amparada no contrato de gestão Nº 001/2021 vigente desde 01/01/2021, firmado entre a SESA e a FUNEAS, estipula a operacionalização da gestão e a execução de ações e serviços de saúde no âmbito do Sistema Único de Saúde SUS nas Unidades Assistenciais e Operacionais Próprias da Secretaria de Estado da Saúde, incluindo a aquisição de insumos, medicamentos, materiais médico-hospitalar, entre outros itens fundamentais para o funcionamento das Unidades hospitalares.</p>
        <p class="indent">Neste sentido, está determinado que a FUNEAS realize as aquisições de todos os materiais médicos hospitalares, medicamentos, nutrição, saneantes, materiais de higiene, insumos gerais, entre outros, padronizados ou não nas Unidades, que permitam a execução das ações elencadas no Contrato de Gestão.</p>
        <p class="indent">A Diretoria da Fundação Estatal de Atenção em Saúde do Estado do Paraná – FUNEAS no uso de suas atribuições legais e estatutárias, com fundamento da Lei Estadual nº 17.959/2014, que autorizou sua criação, estabeleceu que a entidade é dotada de personalidade jurídica de direito privado e sem fins lucrativos, de interesse e utilidade públicos, com autonomia gerencial, patrimonial, orçamentária e financeira, sujeita ao regime jurídico próprio das entidades privadas sem fins lucrativos de beneficência social quanto aos direitos e obrigações civis, comerciais, trabalhistas, tributários e fiscais.</p>
        
        <p class="bold" style="margin-top: 15px;">DA LEGALIDADE</p>
        <p class="indent">A saúde é um direito fundamental previsto no art. 6º e 196 e da Constituição Federal, pois “A saúde é direito de todos e dever do Estado, garantido mediante políticas sociais e econômicas que visem à redução do risco de doença e de outros agravos e ao acesso universal e igualitário às ações e serviços para sua promoção, proteção e recuperação.”</p>
        <p class="indent">As compras públicas regem-se pela Lei Federal nº 14.133/2021 e Decreto Estadual nº 10.086/2022, e demais regulamentações, portanto, imperativo que a contratação pretendida ocorra mediante processo licitatório, na modalidade de contratação da Ata nº<strong>{{ NUMERO_ATA }}</strong> em que a FUNEAS é órgão participante.</p>
        
        <p class="bold" style="margin-top: 15px;">DO INTERESSE PÚBLICO</p>
        <p class="indent">De acordo com a Lei 8.080/1990 em seu artigo 2° que regulamenta “A saúde é um direito fundamental do ser humano, devendo o Estado prover condições indispensáveis ao seu pleno exercício”, sendo indiscutível a importância dos serviços de saúde para atendimento da população.</p>
        <p class="indent">Solicitamos a aquisição por meio de Ata de Registro de Preço para {{ texto_ia_motivacao }}, com a estimativa de consumo para o período de 12 meses, os itens, desta manifestação de interesse são utilizados de forma integral nas unidades hospitalares, como condição para a execução das atividades assistenciais e terapêuticas, com a finalidade de recuperação da saúde dos pacientes internados e os assistidos pelas unidades e atendimento dia.</p>
        
        <p class="bold" style="margin-top: 15px;">DOS BENEFÍCIOS</p>
        <p>A aquisição de materiais hospitalares é fundamental para o funcionamento eficaz de qualquer instituição de saúde.</p>
        <p class="indent">Estes são alguns dos principais benefícios da aquisição de materiais hospitalares. Uma abordagem estratégica e bem planejada para a aquisição pode melhorar a eficiência operacional, a qualidade do atendimento ao paciente, a conformidade regulatória e a sustentabilidade ambiental, contribuindo para o sucesso e a reputação da instituição de saúde.</p>
        
        <p class="bold" style="margin-top: 15px;">DA VIABILIDADE DA CONTRATAÇÃO</p>
        <p class="indent">A viabilidade da contratação para a aquisição desses materiais médicos depende de vários fatores que devem ser considerados cuidadosamente. Com base nesses aspectos, é possível avaliar a viabilidade da contratação para aquisição de materiais hospitalares. Uma análise completa ajuda a garantir que a contratação seja eficaz, segura, e atenda às necessidades do hospital, contribuindo para a eficiência operacional e para a qualidade do atendimento ao paciente.</p>
        <p class="indent">O quantitativo a ser adquirido pelo presente processo foi definido de acordo com a necessidade das unidades geridas pela FUNEAS, considerando também possíveis momentos de desabastecimento, nos quais fez-se necessário substituições temporárias por outros materiais disponíveis.</p>
        <p class="indent">Assim, justifica-se a solicitação, baseada na solicitação da Unidades para quantificação.</p>

        <p class="indent" style="margin-top: 15px;">Os itens a serem adquiridos são utilizados nas unidades geridas pela FUNEAS, cito:</p>

        <table>
          <thead>
            <tr><th>LOTE</th><th>ITEM</th><th>CONSUMO ANUAL</th><th>ESTOQUE EM {{ data_do_dia }}</th><th>QTD SOLICITADA</th></tr>
          </thead>
          <tbody>
            {% tr for item in itens_para_tabela %}
            <tr>
              <td>{{ item.lote }}</td>
              <td style="text-align: left;">{{ item.item_descricao }}</td>
              <td>{{ item.consumo_anual }}</td>
              <td>{{ item.estoque_atual }}</td>
              <td>{{ item.quantidade_solicitada }}</td>
            </tr>
            {% endtr %}
          </tbody>
        </table>

        <div class="signature-block">
          <div class="signature">(assinado eletronicamente)<br><strong>{{ nome_usuario }}</strong><br>Assistente Administrativo – DA/SAQ/GPAQ</div>
          <div class="signature">Ciente e de acordo,<br>(assinado eletronicamente)<br><strong>Andréia Rodrigues Lima</strong><br>Gerente de Planejamento de Aquisições – DA/SAQ/GPAQ</div>
        </div>
    </div>
  </body>
  </html>
`;

// --- TEMPLATE 2: MEMORANDO ---
export const TEMPLATE_MEMORANDO = `
  <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head>
    <meta charset="utf-8">
    ${CSS_PADRAO}
    <xml>
      <w:WordDocument>
        <w:View>Print</w:View>
        <w:Zoom>100</w:Zoom>
      </w:WordDocument>
    </xml>
  </head>
  <body lang=PT-BR>
    <div class=Section1>
      ${WORD_HEADER_CONTENT}
      ${WORD_FOOTER_CONTENT}

      <table class="no-border" style="width: 100%; margin-bottom: 20px; margin-top: 10px;">
        <tr>
          <td align="left" style="text-align: left; font-weight: bold;">Memo nº {{ numero_memorando }}</td>
          <td align="right" style="text-align: right; font-weight: bold;">Curitiba, {{ data_do_dia }}</td>
        </tr>
      </table>

      <p style="margin: 0;"><strong>Diretoria de Gestão de Suprimentos – DS</strong></p>
      <p style="margin: 0;">Gerência de Planejamento de Aquisições – DS/GPAQ</p>
      <p style="margin-top: 10px;"><strong>À Diretoria da Presidência</strong></p>

      <div style="border: 1px solid #000; padding: 10px; margin: 20px 0; background-color: #f9f9f9;">
        <strong>Assunto:</strong> Processo <strong>{{ NUMERO_PROTOCOLO }}</strong> de Aquisição através de Ata de Registro de Preço de <strong>{{ NUMERO_ATA }}</strong> para atender a demanda da Fundação Estatal de Atenção em Saúde do Paraná – FUNEAS.
      </div>

      <div class="text-justify">
        <p class="indent">Solicitamos a autorização para aquisição de item em Ata de Registro de Preço registrada sob nº <strong>{{ NUMERO_ATA }}</strong>, PE nº <strong>{{ NUMERO_PE }}</strong> válida até <strong>{{ VALIDADE_ATA }}</strong>, na qual a FUNEAS possui uma cota/saldo disponível, conforme relatório/mapa de consumo em anexo.</p>
      </div>

      {{ TABELAS_COMPRA_DINAMICAS }}

      <div class="text-justify">
          <p class="indent">A aquisição/contratação será formalizada por meio de Contrato Administrativo – conforme previsto no Edital da Ata. O objeto deverá ser entregue de forma imediata e integral, do qual não resulte obrigação futura, no prazo de até 30 (trinta) dias da assinatura do contrato e apresentação de Ordem de Compra ao fornecedor.</p>
          
          <div style="margin-top: 15px; border: 1px dotted #999; padding: 10px;">
            <p><strong>Local de entrega:</strong></p>
            <p>CENTRAL DE DISTRIBUIÇÃO FUNEAS</p>
            <p>End.: Rua Francisco Munõz Madrid, 625 – Bairro: Roseira de São Sebastião, São José dos Pinhais – PR - CEP: 83.070-152</p>
            <p>Responsável: Ivã Antonio Oliveira | Tel: (41) 3798-5373 Ramal 2817</p>
            <p>E-mail: recebimento.cwb@simaslog.com.br / ges-tao.curitiba@simaslog.com.br / ivan.funeas@gmail.com</p>
            <p>Horário: Segunda à Sexta – feira das 8h às 17h. (Mediante agendamento)</p>
          </div>

          <p class="bold" style="margin-top: 15px;">JUSTIFICATIVA DA QUANTIDADE</p>
          <p class="indent">A quantidade solicitada corresponde à demanda atual para garantir o abastecimento sem gerar excesso de estoque, realizar uma compra parcial dos itens constantes na Ata de Registro de Preços nos permite um melhor controle do estoque, evitando desperdícios e otimizando o uso dos recursos disponíveis.</p>
          <p class="indent">A decisão de não solicitar todos os itens da ata neste momento baseia-se na análise das necessidades imediatas e no planejamento estratégico de aquisição de Materiais Médicos Hospitalares. Isso visa garantir a eficiência na gestão dos recursos e a manutenção do estoque em níveis adequados, evitando assim o acúmulo desnecessário de Materiais Médicos Hospitalares.</p>
      </div>

       <table>
          <thead>
            <tr><th>LOTE</th><th>ITEM</th><th>CONSUMO ANUAL</th><th>ESTOQUE EM {{ data_do_dia }}</th><th>QTD SOLICITADA</th></tr>
          </thead>
          <tbody>
            {% tr for item in itens_para_tabela %}
            <tr>
              <td>{{ item.lote }}</td>
              <td style="text-align: left;">{{ item.item_descricao }}</td>
              <td>{{ item.consumo_anual }}</td>
              <td>{{ item.estoque_atual }}</td>
              <td>{{ item.quantidade_solicitada }}</td>
            </tr>
            {% endtr %}
          </tbody>
        </table>

      <div class="text-justify" style="margin-top: 20px; margin-bottom: 30px;">
        <p class="indent">Deste modo, indicamos abaixo os servidores a serem designados para a certificação dos Materiais Médicos a serem recebidos:</p>
        <p>1. <strong>Recebimento provisório:</strong> Rafaela Junqueira Peres, Assistente Nível I, CPF: 103.309.429-30</p>
        <p>2. <strong>Recebimento definitivo:</strong> Ivã Antonio de Oliveira, Gerente de Abastecimento, CPF 091.576.768-60</p>
        <p class="indent" style="margin-top: 15px;">Por todo o exposto, solicitamos a autorização para prosseguimento do pedido.</p>
      </div>

      <div class="signature-block">
        <div class="signature">
          (assinado eletronicamente)<br>
          <strong>{{ nome_usuario }}</strong><br>
          Assistente Administrativo – DS/GPAQ
        </div>
        <div class="signature">
          Ciente e de acordo,<br>
          (assinado eletronicamente)<br>
          <strong>Andréia Rodrigues Lima</strong><br>
          Gerente de Planejamento de Aquisições
        </div>
        <div class="signature">
          (assinado eletronicamente)<br>
          <strong>Milton Proença Júnior</strong><br>
          Diretor de Gestão de Suprimentos
        </div>
      </div>
    </div>
  </body>
  </html>
`;