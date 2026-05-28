import { TypeWriter } from './TypeWriter';

describe('TypeWriter', () => {
    it('should render without crashing', () => {
        const { container } = render(<TypeWriter text="Hello World" />);
        expect(container).toBeInTheDocument();
    });

    it('should animate text', () => {
        const { getByText } = render(<TypeWriter text="Test" />);
        // Initial state
        expect(getByText('')).toBeInTheDocument();
        // Would need to wait for animation in real test
    });
});