
const HoverModal = styled.div`
& {
  cursor: pointer;
  margin-left: 1em;
  padding: .2em;
  position: relative;
  z-index: 10;
}
& .options-wrapper {
  display: none;

  position: absolute;
  top: 90%;
  left: 50%;
  transform: translate(-50%, 0);
  padding: 0.5em 2em 2em 2em;
  min-width: 100px;
}
& .options {
  background: var(--color-background);
  border: solid 1px var(--color-very-muted-less);

  border-radius: 6px;
  box-shadow: 3px 6px 12px 2px rgba(20, 20, 20, .2);

  animation-name: slide-from-top;
  animation-iteration-count: 1;
  animation-duration: .15s;
}
& .options .option {
  display: block;
  color: var(--color-text);
  padding: .2em .4em;
  width: 100%;
  box-sizing: border-box;
  text-align: center;

  &:hover {
    background: var(--color-very-muted-less);
  }
}

& .options .option + .option {
  border-top: 1px solid var(--color-very-muted-less);
  border-radius: 0;
}

&:hover {
  border-color: var(--color-very-muted-less);
}
&:hover .options-wrapper {
  display: block;
}
@keyframes slide-from-top {
  from {
    transform: translate(0, -6px);
  }

  to {
    transform: translate(0, 0);
  }
}
`;

export default HoverModal;