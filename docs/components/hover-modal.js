
const HoverModal = styled.div`
& {
  cursor: pointer;
  margin-left: 1em;
  padding: .2em;
  position: relative;
  z-index: 10;
}

.title {
  position: relative;

  span::after {
    position: absolute;
    right: -10px;
    top: 55%;
    line-height: 0px;
    content: "<";
    transform: rotate(90deg);
    font-size: 50%;
    transition: .1s all ease-in-out;
  }
}

& .options-wrapper {
  display: none;

  position: absolute;
  top: 90%;
  left: 50%;
  transform: translate(-50%, 0);
  padding: 0.5em 2em 2em 2em;
  min-width: 100px;
  white-space: nowrap;

  // when the origin-left class is added, the drop down menu has is no longer
  // centered on the vertical axis. Instead it is placed on the left of its
  // parent
  &.origin-left {
    left: 0%;
    transform: translate(-20px, 0px);

    .option {
      text-align: left;
    }
  }
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

  span::after {
    transform: rotate(-90deg);
  }
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