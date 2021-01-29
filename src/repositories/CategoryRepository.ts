import { EntityRepository, Repository, In } from 'typeorm';

import Category from '../models/Category';

@EntityRepository(Category)
// eslint-disable-next-line prettier/prettier
class CatetoryRepository extends Repository<Category> {
  public async saveCategoriesByTitle(titles: string[]): Promise<Category[]> {
    let categoriesTitleToSave = [];

    const categoriesInRepository = await this.find({
      select: ['title'],
      where: {
        title: In(titles)
      }
    });

    if (categoriesInRepository.length) {
      const categoriesTitleInRepository = categoriesInRepository.map(category => category.title);

      categoriesTitleToSave = titles.filter(title => !categoriesTitleInRepository.includes(title));
    } else {
      categoriesTitleToSave = titles;
    }

    if (!categoriesTitleToSave.length) {
      return [];
    }

    const categoriesToSave: Category[] = categoriesTitleToSave
      .filter((value, index, self) => {
        return self.indexOf(value) === index;
      })
      .map(title => this.create({ title }));

    return this.save(categoriesToSave);
  }
}

export default CatetoryRepository;
