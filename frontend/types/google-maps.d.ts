declare namespace JSX {
  interface IntrinsicElements {
    'gmp-place-autocomplete': {
      ref?: React.Ref<any>;
      placeholder?: string;
      className?: string;
      style?: React.CSSProperties;
      'type-restrictions'?: string;
      country?: string;
      value?: string;
      place?: any;
      onGmpPlaceselect?: (event: CustomEvent) => void;
      onInput?: (event: Event) => void;
    };
  }
}

declare global {
  interface Window {
    initGoogleMaps: () => void;
  }
}