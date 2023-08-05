import * as libClassValidator from 'class-validator';
import { ClassValidatorFields } from './class-validator-field';

class StubClassValidatorFields extends ClassValidatorFields<{
  field: string;
}> {}

describe('ClassValidatorFields unit tests', () => {
  it('should initialize errors with an empty object', () => {
    const sut = new StubClassValidatorFields();
    expect(sut.errors).toEqual({});
  });

  it('should initialize validatedData with null', () => {
    const sut = new StubClassValidatorFields();
    expect(sut.validatedData).toBeNull();
  });

  describe('validate method', () => {
    it('should return false and set errors when validation fails', () => {
      const validationError = {
        property: 'field',
        constraints: { isRequired: 'any error' },
      };
      jest
        .spyOn(libClassValidator, 'validateSync')
        .mockReturnValue([validationError]);

      const sut = new StubClassValidatorFields();

      const isValid = sut.validate(null);

      expect(isValid).toBeFalsy();
      expect(sut.validatedData).toBeNull();
      expect(sut.errors).toMatchObject({ field: ['any error'] });

      expect(libClassValidator.validateSync).toHaveBeenCalled();
    });
  });
});
