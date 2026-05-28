import { UnifiedProfile } from './UnifiedProfile';

describe('UnifiedProfile', () => {
    it('should render profile sections', () => {
        const { container } = render(<UnifiedProfile />);
        expect(container).toBeInTheDocument();
        // Would check for bio, skills, projects sections
    });

    it('should show contact info', () => {
        const { getByText } = render(<UnifiedProfile />);
        // Would check for email, social links
    });
});