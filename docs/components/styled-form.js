
const StyledForm = styled.div`
  label {
    text-transform: capitalize;
  }

  .row {
    display: flex;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    /* font-size: 1em; */
  }

  .left {
    flex-grow: 1;
    max-width: 33%;
    font-size: 1em;
  }

  .left label {
    color: var(--color-accent);
  }

  .left .description {
    max-width: 80%;
  }

  .right {
    flex-grow: 2;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: 1em;
    padding-left: 2em;
  }

  .right label {
    font-weight: bold;
    margin-bottom: .2em;
    font-size: .8em;
  }

  .right input + label,
  .right textarea + label {
    margin-top: 1em;
  }

  input, textarea {
    min-width: 50%;
  }

  section + section {
    margin-top: 2em;
    padding-top: 2em;
    border-top: solid 1px rgba(220, 220, 220, .05);
  }
`;

export default StyledForm;