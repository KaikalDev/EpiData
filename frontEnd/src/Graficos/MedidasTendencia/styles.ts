import styled from 'styled-components'

export const MedidasTendenciaContainer = styled.div`
  .header {
    display: flex;
    align-items: start;
    flex-direction: column;
    gap: 10px;
    width: 100%;

    p {
      margin-left: 10px;
    }
  }

  .cardList {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
    margin-top: 20px;
    margin-bottom: 20px;

    .card {
      background: #f9f9f9;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  }
`
