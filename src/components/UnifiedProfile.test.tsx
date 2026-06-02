import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { UnifiedProfile } from './UnifiedProfile';

describe('UnifiedProfile', () => {
    it('should render profile sections', () => {
        const { container } = render(<UnifiedProfile />);
        expect(container).toBeInTheDocument();
    });
});