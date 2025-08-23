# Schemas

## AwardsSection

_Object containing the following properties:_

| Property  | Type                                                                                                                                                                                                                                            | Default |
| :-------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------ |
| `strings` | _Object with properties:_<ul><li>`awards`: `string`</li></ul>                                                                                                                                                                                   | `{}`    |
| `awards`  | _Array of objects:_<br /><ul><li>`$id`: `string` (_nullable_)</li><li>**`title`** (\*): `string`</li><li>`date`: `string` (_nullable_)</li><li>`awarder`: `string` (_nullable_)</li><li>`summary`: `string` (_nullable_)</li></ul> (_nullable_) |         |

_All properties are optional._

## BasicsSection

_Object containing the following properties:_

| Property          | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| :---------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`basics`** (\*) | _Object with properties:_<ul><li>**`name`** (\*): `string`</li><li>`label`: `string` (_nullable_)</li><li>`image`: `string` (_nullable_)</li><li>`email`: `string` (_nullable_)</li><li>`phone`: `string` (_nullable_)</li><li>`url`: `string` (_nullable_)</li><li>`summary`: `string` (_nullable_)</li><li>`location`: _Object with properties:_<ul><li>`address`: `string` (_nullable_)</li><li>`postalCode`: `string \| number` (_nullable_)</li><li>`city`: `string` (_nullable_)</li><li>`countryCode`: `string` (_nullable_)</li><li>`region`: `string` (_nullable_)</li></ul> (_nullable_)</li><li>`locationFormat`: `string` (_nullable_)</li><li>`profiles`: _Array of objects:_<br /><ul><li>**`network`** (\*): `string`</li><li>**`username`** (\*): `string`</li><li>**`url`** (\*): `string` (_url_)</li></ul> (_nullable_)</li><li>`highlights`: `Array<string>` (_nullable_)</li><li>`order`: `Array<string>` (_nullable_)</li><li>`icons`: _Object with dynamic keys of type_ `string` _and values of type_ [IconConfig](#iconconfig) (_nullable_)</li></ul> |

_(\*) Required._

## CertificatesSection

_Object containing the following properties:_

| Property       | Type                                                                                                                                                                                                                                              | Default |
| :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------ |
| `strings`      | _Object with properties:_<ul><li>`certificates`: `string`</li></ul>                                                                                                                                                                               | `{}`    |
| `certificates` | _Array of objects:_<br /><ul><li>`$id`: `string` (_nullable_)</li><li>**`name`** (\*): `string`</li><li>`date`: `string` (_nullable_)</li><li>`issuer`: `string` (_nullable_)</li><li>`url`: `string` (_url_) (_nullable_)</li></ul> (_nullable_) |         |

_All properties are optional._

## EducationSection

_Object containing the following properties:_

| Property    | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Default |
| :---------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------ |
| `strings`   | _Object with properties:_<ul><li>`education`: `string`</li><li>`gpa`: `string`</li><li>`untilNow`: `string`</li></ul>                                                                                                                                                                                                                                                                                                                                                                         | `{}`    |
| `education` | _Array of objects:_<br /><ul><li>`$id`: `string` (_nullable_)</li><li>`institution`: `string` (_nullable_)</li><li>`url`: `string` (_url_) (_nullable_)</li><li>`area`: `string` (_nullable_)</li><li>`studyType`: `string` (_nullable_)</li><li>`startDate`: `string` (_nullable_)</li><li>`endDate`: `string` (_nullable_)</li><li>`score`: `string \| number` (_nullable_)</li><li>`courses`: `Array<string>` (_nullable_)</li><li>`summary`: `string` (_nullable_)</li></ul> (_nullable_) |         |

_All properties are optional._

## IconConfig

_Object containing the following properties:_

| Property        | Type                  |
| :-------------- | :-------------------- |
| `suite`         | `string` (_nullable_) |
| **`icon`** (\*) | `string`              |

_(\*) Required._

## InterestsSection

_Object containing the following properties:_

| Property    | Type                                                                                                                                                                    | Default |
| :---------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------ |
| `strings`   | _Object with properties:_<ul><li>`interests`: `string`</li></ul>                                                                                                        | `{}`    |
| `interests` | _Array of objects:_<br /><ul><li>`$id`: `string` (_nullable_)</li><li>**`name`** (\*): `string`</li><li>`keywords`: `Array<string>` (_nullable_)</li></ul> (_nullable_) |         |

_All properties are optional._

## LanguagesSection

_Object containing the following properties:_

| Property    | Type                                                                                                                                                                | Default |
| :---------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------ |
| `strings`   | _Object with properties:_<ul><li>`languages`: `string`</li></ul>                                                                                                    | `{}`    |
| `languages` | _Array of objects:_<br /><ul><li>`$id`: `string` (_nullable_)</li><li>**`language`** (\*): `string`</li><li>`fluency`: `string` (_nullable_)</li></ul> (_nullable_) |         |

_All properties are optional._

## ProjectsSection

_Object containing the following properties:_

| Property   | Type                                                                                                                                                                                                                                                                                                                                                    | Default |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------ |
| `strings`  | _Object with properties:_<ul><li>`projects`: `string`</li><li>`untilNow`: `string`</li></ul>                                                                                                                                                                                                                                                            | `{}`    |
| `projects` | _Array of objects:_<br /><ul><li>`$id`: `string` (_nullable_)</li><li>**`name`** (\*): `string`</li><li>`startDate`: `string` (_nullable_)</li><li>`endDate`: `string` (_nullable_)</li><li>`description`: `string` (_nullable_)</li><li>`highlights`: `Array<string>` (_nullable_)</li><li>`url`: `string` (_url_) (_nullable_)</li></ul> (_nullable_) |         |

_All properties are optional._

## PublicationsSection

_Object containing the following properties:_

| Property       | Type                                                                                                                                                                                                                                                                                                 | Default |
| :------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------ |
| `strings`      | _Object with properties:_<ul><li>`publications`: `string`</li></ul>                                                                                                                                                                                                                                  | `{}`    |
| `publications` | _Array of objects:_<br /><ul><li>`$id`: `string` (_nullable_)</li><li>**`name`** (\*): `string`</li><li>`publisher`: `string` (_nullable_)</li><li>`releaseDate`: `string` (_nullable_)</li><li>`url`: `string` (_url_) (_nullable_)</li><li>`summary`: `string` (_nullable_)</li></ul> (_nullable_) |         |

_All properties are optional._

## ReferencesSection

_Object containing the following properties:_

| Property     | Type                                                                                                                                                              | Default |
| :----------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------ |
| `strings`    | _Object with properties:_<ul><li>`references`: `string`</li></ul>                                                                                                 | `{}`    |
| `references` | _Array of objects:_<br /><ul><li>`$id`: `string` (_nullable_)</li><li>**`name`** (\*): `string`</li><li>`reference`: `string` (_nullable_)</li></ul> (_nullable_) |         |

_All properties are optional._

## SkillsSection

_Object containing the following properties:_

| Property  | Type                                                                                                                                                                                                           | Default |
| :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------ |
| `strings` | _Object with properties:_<ul><li>`skills`: `string`</li></ul>                                                                                                                                                  | `{}`    |
| `skills`  | _Array of objects:_<br /><ul><li>`$id`: `string` (_nullable_)</li><li>**`name`** (\*): `string`</li><li>`level`: `string` (_nullable_)</li><li>`keywords`: `Array<string>` (_nullable_)</li></ul> (_nullable_) |         |

_All properties are optional._

## VolunteerSection

_Object containing the following properties:_

| Property    | Type                                                                                                                                                                                                                                                                                                                                                                                              | Default |
| :---------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------ |
| `strings`   | _Object with properties:_<ul><li>`volunteer`: `string`</li><li>`untilNow`: `string`</li></ul>                                                                                                                                                                                                                                                                                                     | `{}`    |
| `volunteer` | _Array of objects:_<br /><ul><li>`$id`: `string` (_nullable_)</li><li>**`organization`** (\*): `string`</li><li>**`position`** (\*): `string`</li><li>`url`: `string` (_url_) (_nullable_)</li><li>`startDate`: `string` (_nullable_)</li><li>`endDate`: `string` (_nullable_)</li><li>`summary`: `string` (_nullable_)</li><li>`highlights`: `Array<string>` (_nullable_)</li></ul> (_nullable_) |         |

_All properties are optional._

## WorkSection

_Object containing the following properties:_

| Property  | Type                                                                                                                                                                                                                                                                                                                                                                                                                                | Default |
| :-------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------ |
| `strings` | _Object with properties:_<ul><li>`work`: `string`</li><li>`untilNow`: `string`</li></ul>                                                                                                                                                                                                                                                                                                                                            | `{}`    |
| `work`    | _Array of objects:_<br /><ul><li>`$id`: `string` (_nullable_)</li><li>`name`: `string` (_nullable_)</li><li>**`position`** (\*): `string`</li><li>`url`: `string` (_url_) (_nullable_)</li><li>`location`: `string` (_nullable_)</li><li>**`startDate`** (\*): `string`</li><li>`endDate`: `string` (_nullable_)</li><li>`summary`: `string` (_nullable_)</li><li>`highlights`: `Array<string>` (_nullable_)</li></ul> (_nullable_) |         |

_All properties are optional._
