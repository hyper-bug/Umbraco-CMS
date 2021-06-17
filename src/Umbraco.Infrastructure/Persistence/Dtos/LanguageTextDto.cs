using System;
using NPoco;
using Umbraco.Cms.Infrastructure.Persistence.DatabaseAnnotations;

namespace Umbraco.Cms.Infrastructure.Persistence.Dtos
{
    [TableName(Cms.Core.Constants.DatabaseSchema.Tables.DictionaryValue)]
    [PrimaryKey("pk")]
    [ExplicitColumns]
    public class LanguageTextDto
    {
        [Column("pk")]
        [PrimaryKeyColumn]
        public int PrimaryKey { get; set; }

        [Column("languageId")]
        [ForeignKey(typeof(LanguageDto), Column = "id")]
        public int LanguageId { get; set; }

        [Column("UniqueId")]
        [ForeignKey(typeof(DictionaryDto), Column = "id")]
        public Guid UniqueId { get; set; }

        // TODO: Need a unique constraint on LanguageId, UniqueId, Value
        [Column("value")]
        [Length(1000)]
        public string Value { get; set; }
    }
}
