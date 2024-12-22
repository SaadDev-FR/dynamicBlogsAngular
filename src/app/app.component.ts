import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-root', // Using your provided selector
  templateUrl: './app.component.html', // Using your provided template path
  styleUrls: ['./app.component.css'], // Using your provided style path
})
export class AppComponent implements OnInit {
  updateBlogForm!: FormGroup;

  sectionData = {
    mainHeading: 'Main Heading 1',
    mainDescription: 'Description 1',
    blogName: 'Blog Name 1',
    category: 'Category 1',
    mainImage: 'ImageURL1',
    subSections: [
      {
        subHeading: 'SubHeading 1',
        description: 'sub Description 1',
        image: 'SubImageURL1',
        bullets: ['Bullet 1', 'Bullet 1'],
        descriptions: [
          { text: 'Sub Description 1', bullets: ['D1 Bullet 1', 'D1 Bullet 1'] }
        ],
      },
      {
        subHeading: 'SubHeading 2',
        description: 'sub Description 2',
        image: 'SubImageURL2',
        bullets: ['Bullet 2', 'Bullet 2'],
        descriptions: [
          { text: 'Sub Description 2', bullets: ['D2 Bullet 2'] },
          { text: 'Sub Description 2', bullets: ['D2 Bullet 2', 'D2 Bullet 2'] },
        ],
      },
    ],
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.updateBlogForm = this.fb.group({
      mainHeading: ['', Validators.required],
      mainDescription: ['', Validators.required],
      blogName: ['', Validators.required],
      category: ['', Validators.required],
      mainImage: ['', Validators.required],
      subSections: this.fb.array([]),
    });

    this.populateData(); // Populate form with the initial data
  }

  // Get the subSections FormArray
  getSubSections(): FormArray {
    return this.updateBlogForm.get('subSections') as FormArray;
  }

  // Get the descriptions FormArray for a specific subsection
  getDescriptions(subSectionIndex: number): FormArray {
    return (this.getSubSections().at(subSectionIndex) as FormGroup).get('descriptions') as FormArray;
  }

  // Get the bullets FormArray for a specific description
  getBulletsForDescription(subSectionIndex: number, descriptionIndex: number): FormArray {
    return this.getDescriptions(subSectionIndex).at(descriptionIndex).get('bullets') as FormArray;
  }

  // Populate the form with data
  populateData(): void {
    this.updateBlogForm.patchValue({
      mainHeading: this.sectionData.mainHeading,
      mainDescription: this.sectionData.mainDescription,
      blogName: this.sectionData.blogName,
      category: this.sectionData.category,
      mainImage: this.sectionData.mainImage,
    });

    const subSectionsFormArray = this.getSubSections();
    this.sectionData.subSections.forEach((subSection) => {
      console.log('subSection is??',subSection);
      const descriptionsFormArray = this.fb.array([]);
      subSection.descriptions.forEach((desc) => {
        console.log('desc is??',desc);
        
        const bulletsFormArray = this.fb.array(desc.bullets.map((bullet) => this.fb.control(bullet, Validators.required)));
        descriptionsFormArray.push(
          this.fb.group({
            text: [desc.text, Validators.required],
            bullets: bulletsFormArray,
          })
        );
      });

      subSectionsFormArray.push(
        this.fb.group({
          subHeading: [subSection.subHeading, Validators.required],
          description: [subSection.description, Validators.required],
          image: [subSection.image, Validators.required],
          descriptions: descriptionsFormArray,
        })
      );
    });
  }

  // Add a new subsection
  addSubsection(): void {
    const subSections = this.getSubSections();
    subSections.push(
      this.fb.group({
        subHeading: ['', Validators.required],
        description: ['', Validators.required],
        image: ['', Validators.required],
        descriptions: this.fb.array([]),
      })
    );
  }

  // Add a new description under a specific subsection
  addDescriptionUnder(subSectionIndex: number, descriptionIndex: number): void {
    const descriptionsArray = this.getDescriptions(subSectionIndex);
    descriptionsArray.insert(descriptionIndex + 1, this.createDescription());
  }

  // Create a new description FormGroup
  createDescription(): FormGroup {
    return this.fb.group({
      text: ['', Validators.required],
      bullets: this.fb.array([]),
    });
  }

  // Add a bullet to a specific description
  addBulletForDescription(subSectionIndex: number, descriptionIndex: number): void {
    const bulletsArray = this.getBulletsForDescription(subSectionIndex, descriptionIndex);
    bulletsArray.push(this.fb.control('', Validators.required));
  }

  // Submit the form
  submitForm(): void {
    if (this.updateBlogForm.valid) {
      console.log(this.updateBlogForm.value);
      alert('Form submitted successfully!');
    } else {
      alert('Please fill out all required fields.');
    }
  }
}
